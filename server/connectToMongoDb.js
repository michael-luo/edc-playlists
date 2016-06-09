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
    // Feed some dummy data in DB in devo.
    if (process.env.NODE_ENV !== 'production') {
      dummyData();
    }

    if (process.env.POPULATE_EVENTS === 'enabled') {
      initEvents();
    }
  });

  return mongoose;
}
