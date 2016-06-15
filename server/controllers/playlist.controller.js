import SpotifyWebApi from 'spotify-web-api-node';
import * as SpotifyUtil from '../util/spotify';
import Track from '../models/track';
import Playlist from '../models/playlist';
import Promises from 'bluebird';
import _ from 'underscore';

const MAX_NUM_ARTISTS_PER_MUSIC_EVENT = 280; // i.e. EDC does not have more than this many artists
const DEFAULT_NUM_TOP_SONGS = 2;
const MAX_NUM_TOP_SONGS = 10;
const DEFAULT_PLAYLIST_NAME = `'s Playlist`;

export function getPlaylists(req, res) {
  Playlist.find()
    .sort('-dateAdded')
    .limit(150)
    .exec((err, playlists) => {
      if (err) {
        return res.status(500).json({ data: {}, err });
      }
      res.json({ data: playlists });
    });
}

export function getPlaylist(req, res) {
  const playlistId = req.params.playlistId;
  Playlist.findById(playlistId)
    .populate('tracks')
    .populate('event')
    .exec((err, playlist) => {
      if (err) {
        return res.status(500).json({ err, data: {} });
      }
      return res.json({ data: playlist });
    });
}

// Given a list of artist names, look up the top songs of the artist and create a new playlist for user
export function generatePlaylist(req, res) {
  // TODO: Create Spotify playlist
  const spotifyApi = SpotifyUtil.getSpotifyApi(req.user.accessToken, req.user.refreshToken);
  let artistIds = req.body.artists || [];
  let numTopSongs = req.body.songsPerArtist || DEFAULT_NUM_TOP_SONGS;
  let playlistName = req.body.playlistName || req.user.name + DEFAULT_PLAYLIST_NAME;
  let eventId = req.body.eventId;

  // Validate input artist IDs
  if (!_.isArray(artistIds) || _.isEmpty(artistIds)) {
    return res.status(400).json({
      err: 'artists has to be a non-empty array'
    });
  }

  // Validate artists input
  if (artistIds.length > MAX_NUM_ARTISTS_PER_MUSIC_EVENT) {
    const err = {
      err: `${artistIds.length} artists requested but maximum is ${MAX_NUM_ARTISTS_PER_MUSIC_EVENT}`
    };
    return res.status(400).json(err);
  }

  if (!eventId) {
    return res.status(400).json({
      err: 'missing event id'
    });
  }

  // Limit the number of top songs to request per artist
  if (numTopSongs > MAX_NUM_TOP_SONGS || numTopSongs < 1) {
    numTopSongs = DEFAULT_NUM_TOP_SONGS;
  }

  _getArtistTopTracksPromises(spotifyApi, artistIds, req.user.country)
    .then((data) => {
      return _getFinalTracks(artistIds, data, numTopSongs);
    })
    .then((finalTracks) => {
      return _createUserPlaylist(spotifyApi, req.user, playlistName, finalTracks);
    })
    .then((createdPlaylist) => {
      return _persistPlaylistInDb(createdPlaylist, eventId);
    })
    .then((finalPlaylist) => {
      return res.json({ data: finalPlaylist });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ err, data: {} });
    });
}

// Create a list of promises containing each artist's top tracks
function _getArtistTopTracksPromises(spotifyApi, artistIds, country) {
  if (!spotifyApi || !artistIds || artistIds.length === 0) {
    return Promises.resolve({});
  }
  // Default to US just in case
  country = country || 'US';

  return Promises.all(_.map(artistIds, (artistId) =>
    spotifyApi.getArtistTopTracks(artistId, country)));
}

// Strip unnecessary properties and format top tracks of each artist
function _getFinalTracks(artistIds, data, numTopSongs) {
  const artistIdSet = new Set(artistIds);
  // Each element in the array is a list of top tracks for the mapped artist
  const artistsTopTracks = _.map(data, (tracks) => {
    if (!tracks || !tracks.body || !tracks.body.tracks) {
      return [];
    }
    tracks = tracks.body.tracks.slice(0, numTopSongs);

    return _.map(tracks, (track) => {
      delete track.album;
      delete track.available_markets;
      delete track.explicit;
      delete track.external_ids;

      // Find the primary artist
      if (track.artists) {
        for (const artist of track.artists) {
          if (artistIdSet.has(artist.id)) {
            track.artist = artist.name;
          }
        }
        track.artist = track.artist || 'Unknown';
      }

      delete track.artists;
      return track;
    });
  });

  return _.flatten(artistsTopTracks, true);
}

// Create playlist for user of the final aggregated tracks
function _createUserPlaylist(spotifyApi, user, playlistName, finalTracks) {
  return spotifyApi.createPlaylist(user.spotify.id, playlistName, { public: true })
    .then((data) => {
      // Add tracks to the playlist id
      return _addTracksToPlaylist(spotifyApi, user, data.body, finalTracks)
        .then((finalData) => {
          return finalData;
        })
        .catch((err) => {
          console.log(`Failed to add tracks=${finalTracks} to playlist=${data.body}`);
          return { err, data: {} };
        })
    }, (err) => {
      console.log(`_createUserPlaylist failed: ${err}`);
      return { err, data: {} };
    });
}

function _addTracksToPlaylist(spotifyApi, user, playlistData, finalTracks) {
  const playlistId = playlistData.id;
  const trackUris = _.map(finalTracks, (finalTrack) => {
    return finalTrack.uri;
  });

  return spotifyApi.addTracksToPlaylist(user.spotify.id, playlistId, trackUris)
    .then((data) => {
      console.log(`Successfully added tracks to playlist ${playlistId}`);
      return { playlist: playlistData, tracks: finalTracks };
    })
    .catch((err) => {
      console.log(`Failed to add tracks to playlist ${playlistId}`);
      return { playlist: {}, tracks: {}, err };
    });
}

function _persistPlaylistInDb(createdPlaylist, eventId) {
  const playlist = createdPlaylist.playlist;
  const tracks = createdPlaylist.tracks;

  let trackPromises = [];
  for (const track of tracks) {
    const trackPromise = ((track) => new Promises((resolve, reject) => {
      Track.findOne({ id: track.id }, (err, foundTrack) => {
        if (err) {
          console.log(`Err in _persistPlaylistInDb but adding track ${track.name} anyway`);
        }

        if (err || !foundTrack) {
          let newTrack = new Track({
            id: track.id,
            name: track.name,
            artist: track.artist,
            previewUrl: track.preview_url,
            uri: track.uri,
          });

          newTrack.save((err, saved) => {
            if (err) {
              console.log(`Failed to save new track=${newTrack} to db`);
            } else {
              console.log(`Saved new track ${newTrack.name} to db`);
            }
            resolve(saved);
          });
        } else {
          resolve(foundTrack);
        }
      });
    }))(track);

    trackPromises.push(trackPromise);
  }

  return Promises.all(trackPromises)
    .then((resTracks) => {
      // Finally, create the playlist using these resTrack IDs
      const newPlaylist = new Playlist({
        id: playlist.id,
        ownerId: playlist.owner.id,
        name: playlist.name,
        href: playlist.external_urls.spotify,
        event: eventId,
        tracks: _.map(resTracks, (track) => track._id)
      });
      return new Promises((resolve, reject) => {
        newPlaylist.save((err, saved) => {
          if (err) {
            console.log(`Problem saving user playlist=${newPlaylist}`);
            resolve({ err, data: {} });
          } else {
            console.log(`Successfully saved user playlist=${saved._id}`);
            resolve({
              playlistDbId: saved._id,
              createdPlaylist
            });
          }
        });
      });
    })
    .catch((err) => {
      console.log(`Failed to persist all tracks to db: ${err}`);
    });
}
