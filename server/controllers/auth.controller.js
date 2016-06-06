import User from '../models/user';
import passportSpotify from 'passport-spotify';

const SpotifyStrategy = passportSpotify.Strategy;

const REDIRECT_URI = process.env.redirectUri || 'http://localhost:8000/api/auth/spotify/callback';
const scopes = ['user-read-private', 'user-read-email', 'playlist-modify-public'];

const setUpPassport = (passport) => {
  // Passport session setup.
  //   To support persistent login sessions, Passport needs to be able to
  //   serialize users into and deserialize users out of the session. Typically,
  //   this will be as simple as storing the user ID when serializing, and finding
  //   the user by ID when deserializing.
  passport.serializeUser((user, done) => {
    done(null, user.spotify.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({ 'spotify.id': id }, (error, user) => {
      done(error, user);
    });
  });

  // Save the access token, refreshToken, and user info in db
  const spotifyStrategyCallback = (accessToken, refreshToken, profile, done) => {
    // Check user table for anyone with a Spotify ID of profile.id
    User.findOne({
      'spotify.id': profile.id,
    }, (err, user) => {
      if (err) {
        return done(err);
      }
      // No user was found - create a new user with data from Spotify
      if (!user) {
        let newUser = new User({
          accessToken,
          refreshToken,
          name: profile.displayName,
          profileUrl: profile.profileUrl,
          photos: profile.photos,
          email: profile.emails[0].value,
          // Future searches for User.findOne({'spotify.id': profile.id } will match because of this
          spotify: profile._json,
        });

        // Create new user
        newUser.save((err) => {
          if (err) console.log(err);
          return done(err, newUser);
        });
      } else {
        // User already exists
        return done(err, user);
      }
    });
  };

  // Instantiate SpotifyStrategy
  passport.use(new SpotifyStrategy({
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: REDIRECT_URI,
  }, spotifyStrategyCallback));
};

const AuthController = (passport) => {
  setUpPassport(passport);

  return {
    /**
     * GET /api/auth/spotify
     * Use passport.authenticate() as route middleware to authenticate the
     * request. The first step in spotify authentication will involve redirecting
     * the user to spotify.com. After authorization, spotify will redirect the user
     * back to this application at /api/auth/spotify/callback
     */
    authSpotify: () => {
      return passport.authenticate('spotify', {
        scope: scopes,
        showDialog: true,
      });
    },

    /**
     * GET /api/auth/spotify/callback
     * Use passport.authenticate() as route middleware to authenticate the
     * request. If authentication fails, the user will be redirected back to the
     * login page. Otherwise, the primary route function function will be called,
     * which, in this example, will redirect the user to the home page.
     */
    spotifyCallback: () => {
      return passport.authenticate('spotify', {
        failureRedirect: '/error/unable to sign in to spotify',
      });
    },
  };
};

export default AuthController;
