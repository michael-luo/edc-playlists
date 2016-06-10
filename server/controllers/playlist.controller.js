import SpotifyWebApi from 'spotify-web-api-node';
import Promises from 'bluebird';
import _ from 'underscore';

const MAX_NUM_ARTISTS_PER_MUSIC_EVENT = 280; // i.e. EDC does not have more than this many artists
const DEFAULT_NUM_TOP_SONGS = 2;
const MAX_NUM_TOP_SONGS = 10;

// Given a list of artist names, look up the top songs of the artist and create a new playlist for user
export function generatePlaylist(req, res) {
  const spotifyApi = _getSpotifyApi(req.user);
  let artistIds = req.query.artists || '';
  let numTopSongs = req.query.songsPerArtist || DEFAULT_NUM_TOP_SONGS;

  // Validate input artist IDs
  if (artistIds.trim().length === 0) {
    return res.json({
      err: 'artists query param cannot be empty'
    });
  }

  // Convert artist1,artist2,artist3... into a list
  artistIds = artistIds.trim().split(',');

  // Validate artists input
  if (artistIds.length > MAX_NUM_ARTISTS_PER_MUSIC_EVENT) {
    const err = {
      err: `${artistIds.length} artists requested but maximum is ${MAX_NUM_ARTISTS_PER_MUSIC_EVENT}`
    };
    return res.status(400).json(err);
  }

  // Limit the number of top songs to request per artist
  if (numTopSongs > MAX_NUM_TOP_SONGS || numTopSongs < 1) {
    numTopSongs = DEFAULT_NUM_TOP_SONGS;
  }

  let playlist = {};
  playlist['data'] = {};
  playlist.data = artistIds;

  _getArtistTopTracksPromises(spotifyApi, artistIds, req.user.country)
    .then((data) => {
      return res.json(_getFormattedData(artistIds, data, numTopSongs));
    })
    .catch((err) => {
      return res.status(400).json({ err });
    });
}

// Given a user object containing spotify credentials, initialize the API instance
function _getSpotifyApi(user) {
  if (!user) {
    throw Error('_getSpotifyApi failed due to invalid user');
  }

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  spotifyApi.setAccessToken(user.accessToken);
  spotifyApi.setRefreshToken(user.refreshToken);

  return spotifyApi;
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
function _getFormattedData(artistIds, data, numTopSongs) {
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

  return { data: _.flatten(artistsTopTracks, true) };

}
