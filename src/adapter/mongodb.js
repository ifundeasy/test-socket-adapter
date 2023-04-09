const { createAdapter } = require('@socket.io/mongo-adapter');
const { MongoClient } = require('mongodb');
const { env } = process;

const COLLECTION = 'socket.io-adapter-events';
const host = `mongodb://${env.MONGO_USER}:${env.MONGO_PASS}@${env.MONGO_HOST}:${env.MONGO_PORT}/?replicaSet=${env.MONGO_RSNAME}`;

module.exports = async () => {
  const mongoClient = new MongoClient(host, {
    useUnifiedTopology: true,
  });

  await mongoClient.connect();

  try {
    await mongoClient.db(env.MONGO_DBNAME).createCollection(COLLECTION, {
      capped: true,
      size: 1e6
    });
  } catch (e) {
    // collection already exists
  }
  const mongoCollection = mongoClient.db(env.MONGO_DBNAME).collection(COLLECTION);

  return createAdapter(mongoCollection)
}