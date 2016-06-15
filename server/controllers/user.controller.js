import * as SpotifyUtil from '../util/spotify';

export function self(req, res) {
  console.log(req.user);
  if (req.isAuthenticated() && req.user) {
    const spotifyApi = SpotifyUtil.getSpotifyApi(req.user.accessToken, req.user.refreshToken);
    spotifyApi.getMe()
      .then(() => {
        // Successfully accessed Spotify API
        return res.json({ data: req.user });
      })
      .catch((err) => {
        // Log the user out of the session
        console.log('User access token expired: ', err);
        req.logout();
        return res.json({ data: {}, err});
      });
  } else {
    return res.json({ err: 'Unable to authenticate self', data: {} });
  }
}
