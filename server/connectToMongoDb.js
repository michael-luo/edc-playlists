import mongoose from 'mongoose';
import dummyData from './dummyData';
import initEvents from './populateDbEvents';

export default function connectToMongoDb(connectionString) {
  // MongoDB Connection
  mongoose.connect(connectionString, (error) => {
  if (error) {
    console.log('Failed to connect to MongoDB');
    throw error;
  }

  const connection = mongoose.connection;
  console.log(`Connected to MongoDB ${connection.host}:${connection.port}`);
    // feed some dummy data in DB.
    dummyData();
    initEvents();

  });

  return mongoose;
}
