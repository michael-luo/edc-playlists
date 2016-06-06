import AuthController from '../controllers/auth.controller';

const routeAuth = (router, passport) => {
  const authController = AuthController(passport);
  // Empty function because Spotify will redirect to auth/spotify/callback
  router.route('/auth/spotify').get(
    authController.authSpotify(),
    (req, res) => {});

  router.route('/auth/spotify/callback').get(
    authController.spotifyCallback(),
    (req, res) => { res.redirect('/'); }
  );
};

export default routeAuth;
