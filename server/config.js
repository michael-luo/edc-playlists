const config = {
  mongoURL: process.env.MONGODB_URI || 'mongodb://localhost:27017/discoveredm',
  port: process.env.PORT || 8000,
  spotifyRedirectURL: process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:8000/api/auth/spotify/callback',
};

export default config;
