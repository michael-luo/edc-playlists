import SpotifyWebApi from 'spotify-web-api-node';

export function getSpotifyApi(accessToken, refreshToken) {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  spotifyApi.setAccessToken(accessToken);
  spotifyApi.setRefreshToken(refreshToken);

  return spotifyApi;
}
