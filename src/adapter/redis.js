const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');
const { env } = process;

const pubClient = createClient({
  url: `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`,
  username: env.REDIS_USER,
  password: env.REDIS_PASS,
  database: env.REDIS_DBNAME
});
const subClient = pubClient.duplicate();

module.exports = async () => {
  await pubClient.connect()
  await subClient.connect()
  return createAdapter(pubClient, subClient)
};