const config = {
  mongoURL: process.env.MONGODB_URI || 'mongodb://localhost:27017/discoveredm',
  port: process.env.PORT || 8000,
};

export default config;
