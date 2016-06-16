// A script for pre-populating the DB with music events and Spotify artist objects
import SpotifyWebApi from 'spotify-web-api-node';
import Promises from 'bluebird';
import _ from 'underscore';

import Event from '../server/models/event';
import Artist from '../server/models/artist';

import eventData from '../json/eventData';
import serverConfig from './config';

// For JSON validation of the eventData.js
const v = eventData.validator;

let seedEventData;
if (process.env.NODE_ENV === 'production') {
  seedEventData = eventData.data;
} else {
  seedEventData = eventData.devoData;
}

let spotifyApi;

class RequestDelay {
  constructor(maxBatchSize = 5, delay = 1000) {
    this.maxBatchSize = maxBatchSize;
    this.delay = delay;
    this.currBatchSize = 0;
    this.currDelay = 0;
  }

  get nextDelay() {
    return this.calcNextDelay();
  }

  calcNextDelay() {
    this.currBatchSize = this.currBatchSize + 1;
    if (this.currBatchSize > this.maxBatchSize) {
      this.currDelay = this.currDelay + this.delay;
      this.currBatchSize = 0;
    }
    return this.currDelay;
  }
}

export default function() {
  // Initialize the client
  spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  Promises.promisifyAll(spotifyApi);

  spotifyApi.clientCredentialsGrant({}, (err, result) => {
    if (err) {
      console.log(err);
    }

    // Set the access token for higher rate limit before beginning population
    spotifyApi.setAccessToken(result.body.access_token);

    _clear(Event, (err) => {
      if (err) {
        throw err;
      }
      _populate(seedEventData);
    });
  });
}

// Clear a collection
function _clear(Model, callback) {
  const name = Model.modelName;

  Model.remove({}, (err, res) => {
    if (!res.result.ok) {
      return callback(`Failed to clear '${name}' collection`);
    }

    console.log(`Cleared the '${name}' collection`);
    callback(null);
  });
}

// Populate music events, artists, and top tracks of each artist
// The input data format should look something like:
//
// {
//   events: [
//     {
//       name: 'Electronic Daisy Carnival',
//       year: '2016',
//       days: 3,
//       ref: 'EDC 2016',
//       artists: [
//         '12th Planet',
//         'Zedd',
//       ],
//     }
//   ],
// }
//
// This seed data results in the database being populated with
// the music event, each artist's metadata, and each artist's
// top tracks.
function _populate(data) {
  // Validate events before processing data
  const validationResult = v.validate(data);
  if (!validationResult.valid) {
    return console.error(validationResult.errors);
  }

  const events = data.events;
  const artistSet = _extractDistinctArtistNames(events);

  // Convert set back to an array
  const artistArray = Array.from(artistSet);

  console.log(`Looking up IDs for ${artistArray.length} artists...
    - [${artistArray}]`)

  // Convert a list of string names to models in the DB
  const savedArtistModelsPromise = _processArtistListIntoDatabase(artistArray);
  _processMusicEvents(events, savedArtistModelsPromise, artistArray);
}

// Modify the artists list of each event before saving it
function _processMusicEvents(events, savedArtistModelsPromise, artistArray) {
  savedArtistModelsPromise
    .then((savedArtistModels) => {
      const savedArtistModelNames = _extractArtistNames(savedArtistModels);
      console.log(`Successfully saved ${savedArtistModels.length} artists to DB
        - [${savedArtistModelNames}]`);
      console.log(`Failed to save these artists: ${_getDifference(artistArray, savedArtistModelNames)}`);
      _replaceEventsArtistsWithObjectId(events, savedArtistModels);
      _saveEvents(events);
    });
}

function _getDifference(artistArray, finalArtists) {
  finalArtists = _.map(finalArtists, (finalArtist) => {
    return finalArtist.toLowerCase();
  });
  const finalArtistSet = new Set(finalArtists);
  const diff = [];
  for (const a of artistArray) {
    if (!finalArtistSet.has(a.toLowerCase())) {
      diff.push(a);
    }
  }
  return diff;
}

// Save the event to the database;
function _saveEvents(events) {
  _.each(events, (event) => {
    event = new Event(event);
    event.save((err, saved) => {
      console.log(`Saved ${saved.name} to DB`);
    });
  });
}

function _replaceEventsArtistsWithObjectId(events, savedArtistModels) {
  // Build artistName -> objectId map
  let nameToObjectIdMap = {};
  for (const savedArtistModel of savedArtistModels) {
    nameToObjectIdMap[savedArtistModel.name.toLowerCase()] = savedArtistModel._id;
  }

  let failedArtists = new Set();

  // Use map to replace events' artist lists
  _.each(events, (event) => {
    event.artists = _.map(event.artists, (artist) => {
      const objectId = nameToObjectIdMap[artist.toLowerCase()]
      if (!objectId) {
        failedArtists.add(artist);
      }
      return objectId;
    });

    event.artists = _.filter(event.artists, (artist) => artist);
  });

  if (!_.isEmpty(failedArtists)) {
    console.log(`${failedArtists.size} total artist(s) could not be found
      - ${Array.from(failedArtists)}`);
  }
}

// Convert a list of artist names into Spotify representations in MongoDB
function _processArtistListIntoDatabase(artistArray) {
  return Promises.all(_getArtistPromises(artistArray))
    .then((artistSearchResults) => {
      return _extractArtistsFromSearchResults(artistSearchResults, artistArray);
    })
    .then((foundArtists) => {
      console.log(`Successfully found ${foundArtists.length} artists from search results
        - [${_extractArtistNames(foundArtists)}]`);
      return _convertArtistsToSavedModelsPromises(foundArtists);
    })
    .then((saveArtistModelPromises) => {
      return Promises.all(saveArtistModelPromises);
    })
    .catch((err) => {
      console.log(`Failed to completely populate data for: ${artistArray}`);
      console.error(err);
    });
}

// Aggregate all artist names across all music events into a set
function _extractDistinctArtistNames(events) {
  const artistSet = new Set();

  // Create a set of all artists
  _.each(events, (event) => {
    const artists = event.artists;
    _.each(artists, (artist) => {
      artistSet.add(artist);
    });
  });

  return artistSet;
}

// Use the array as a list of target strings when crawling the search results
function _extractArtistsFromSearchResults(artistSearchResults, artistArray) {
  let foundArtists = [];

  // Loop through each search result and find the target artist
  for (const [index, artistSearchResult] of artistSearchResults.entries()) {
    const target = artistArray[index];
    const foundArtist
      = _findArtistAmongPossibleArtists(artistSearchResult.body.artists.items, target);

    if (foundArtist) {
      foundArtists.push(foundArtist);
    }
  }

  return foundArtists;
}

// Convert Spotify artist objects into saved db models
function _convertArtistsToSavedModelsPromises(spotifyArtists) {
  const artistBodies = _.map(spotifyArtists, (spotifyArtist) => {
    if (!spotifyArtist.id) {
      return null;
    }
    return {
      id: spotifyArtist.id,
      name: spotifyArtist.name,
      genres: spotifyArtist.genres,
      tracks: [],
    };
  });

  // Upsert artists
  return _.map(artistBodies, (artistBody) => {
    return new Promises((resolve, reject) => {
      Artist.findOneAndUpdate({ id: artistBody.id }, artistBody, { upsert: true, new: true },
        (err, foundArtist) => {
          if (err) {
            reject(err);
          }
          resolve(foundArtist);
        });
    });
  });
}

// Create promises to retrieve all artist search results
function _getArtistPromises(artistNames) {
  let rd = new RequestDelay();
  const spotifyArtistPromises = [];
  for (const artist of artistNames) {
    spotifyArtistPromises.push(_getArtistPromise(artist, rd));
  }
  return spotifyArtistPromises;
}

// Create promise to retrieve an artist search result
function _getArtistPromise(artistName, rd) {
  if (typeof(artistName) !== 'string') {
    console.error(`Attempted to call _populateArtist with: ${artistName}`);
    return Promises.resolve({});
  }

  return ((del) => new Promises((resolve, reject) => {
    setTimeout(() => {
      resolve(spotifyApi.searchArtists(artistName));
    }, del);
  }))(rd.nextDelay);
}

// Spotify returns multiple artists for a given search
function _findArtistAmongPossibleArtists(artists, target) {
  if (!artists || !target) {
    return null;
  }
  return _.find(artists, (artist) => {
    return artist.name.toLowerCase() === target.toLowerCase();
  });
}

// Given a list of objects each with a 'name' property, return the list of names
function _extractArtistNames(artists) {
  return _.map(artists, (artist) => artist.name);
}

