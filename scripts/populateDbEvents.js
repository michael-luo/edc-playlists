import dotenv from 'dotenv';
import mongoose from 'mongoose';
const Admin = mongoose.mongo.Admin;

// Load environment variables from .env file in devo
if (process.env.NODE_ENV !== 'production') {
  dotenv.load();
}

const MONGODB_URI = process.env.SCRIPTS_MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(`${MONGODB_URI} not specified in the .env configuration file or as env variable`);
}

// MongoDB connection
const connection = mongoose.createConnection(MONGODB_URI);
connection.on('error', (error) => console.log(error));
connection.on('open', () => {
  console.log(`Connected to MongoDB ${connection.host}:${connection.port}`);
});
