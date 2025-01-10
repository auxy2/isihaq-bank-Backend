import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const { DATABASE_URL, DATABASE_NAME } = process.env;
// const memoryServer = await MongoMemoryServer.create();
mongoose.set('strictQuery', false);

// const { DATABASE_URL, DATABASE_NAME } = process.env;

// const DATABASE_URL =
//   'mongodb+srv://personalemail8000:SirUPUcchBtIu3wM@skyshow.yqgndns.mongodb.net/';
// const DATABASE_NAME = 'SolutionsPlatforms';

let dbConnection;

export const connect = async (uri, dbName) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('Connecting to database...');
      await mongoose.connect(uri, {
        dbName,
      });
      dbConnection = mongoose.connection;
      console.log('Connected to DB:', mongoose.connection.db.databaseName);
    } else {
      console.log('Already connected to database');
    }
    return dbConnection;
  } catch (error) {
    console.error('Error connecting to database:', error.message);
    throw new Error('Database connection failed');
  }
};

export const connectDB = async (dbName = DATABASE_NAME) => {
  await connect(DATABASE_URL, dbName);
};

export const disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};
