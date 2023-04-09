
var createAdapter = require('socket.io-amqp');
const { env } = process;

module.exports = async () => {
  return createAdapter(
    `amqp://${env.AMQP_USER}:${env.AMQP_PASS}@${env.AMQP_HOST}:${env.AMQP_PORT}`,
    { prefix: 'amqp-adapter' }
  );
};