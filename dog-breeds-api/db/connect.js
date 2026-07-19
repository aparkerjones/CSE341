const { MongoClient } = require('mongodb');

const connectionString = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB || 'dog-breeds-db';

if (!connectionString) {
  throw new Error('MONGODB_URI is missing. Add it to your .env file.');
}

const client = new MongoClient(connectionString);
let database;

async function connectToDb() {
  await client.connect();
  database = client.db(databaseName);
  console.log(`Connected to MongoDB database: ${databaseName}`);
  return database;
}

function getDb() {
  if (!database) {
    throw new Error('Database not initialized. Call connectToDb() first.');
  }
  return database;
}

module.exports = {
  connectToDb,
  getDb,
};
