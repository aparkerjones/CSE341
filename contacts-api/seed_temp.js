require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const connectionString = process.env.MONGODB_URI;
if (!connectionString) {
  console.error('MONGODB_URI is missing');
  process.exit(1);
}

async function run() {
  const client = new MongoClient(connectionString);
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('contacts');
    
    // Delete all
    const deleteResult = await collection.deleteMany({});
    console.log(Deleted \ documents.);

    // Load data
    const dataPath = path.join(__dirname, 'data', 'contacts.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const contacts = JSON.parse(rawData);

    // Insert
    const insertResult = await collection.insertMany(contacts);
    console.log(Successfully inserted \ documents.);

    // countDocuments
    const finalCount = await collection.countDocuments();
    console.log(Final document count: \);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
run();
