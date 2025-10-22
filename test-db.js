const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || process.env.COSMOS_CONNECTION_STRING || process.env.AZURE_COSMOS_CONNECTIONSTRING;

console.log('============================================');
console.log('         AZURE DB CONNECTION TEST           ');
console.log('============================================');

if (!MONGODB_URI) {
  console.error('❌ ERROR: Connection string not found in environment variables.');
  process.exit(1);
}

console.log('✓ Connection string found.');
console.log('Attempting to connect...');

const client = new MongoClient(MONGODB_URI);

async function runTest() {
  try {
    await client.connect();
    console.log('✅ SUCCESS: Connected to the database!');
    await client.db('admin').command({ ping: 1 });
    console.log('✓ Ping successful.');
    const dbName = client.db().databaseName;
    console.log(`✓ Database Name: ${dbName}`);
  } catch (error) {
    console.error('❌ FAILED: Could not connect to the database.');
    console.error('Error Details:', error.message);
    if (error.name) {
        console.error('Error Type:', error.name);
    }
  } finally {
    await client.close();
    console.log('Connection closed.');
    console.log('============================================');
  }
}

runTest();
