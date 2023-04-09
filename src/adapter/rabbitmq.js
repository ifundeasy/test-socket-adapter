
const { AdapterFactory } = require('ms-socket.io-adapter-amqp');
const { env } = process;

module.exports = async () => {
  return AdapterFactory.fromOptions({
    debug: false,
    connection: {
      host: env.AMQP_HOST,
      port: env.AMQP_PORT,
      login: env.AMQP_USER,
      password: env.AMQP_PASS
    }
  });
};