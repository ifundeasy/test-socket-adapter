require('dotenv').config();

const { Server } = require('socket.io');
const adapter = require('./adapter');
const { log } = require('./utils');
const { env } = process;
const io = new Server();

io.on('connection', (socket) => {
  const socketId = socket.client.id;
  
  log(new Date(), JSON.stringify({ socketId, event: 'connect', data: undefined }));

  socket.on('disconnect', (reason) => {
    log(new Date(), JSON.stringify({ socketId, event: 'disconnect', data: reason }));
  });

  socket.on('FOO', (whois) => {
    log(new Date(), JSON.stringify({ socketId, event: 'FOO', data: whois }));
    
    socket.emit('BAR', `hi ${whois}!`);
  })
});

const usePort = process.argv[2] || env.SOCKET_PORT || 3000;
const useAdapter = process.argv[3] || env.SOCKET_ADAPTER || 'memory';

const Main = async () => {
  log('Socket using adapter:', useAdapter)

  if (adapter[useAdapter]) io.adapter(await adapter[useAdapter]());
  
  io.listen(usePort);
  log('Socket listen on port:', usePort)
};

if (!module.parent) Main();
else module.exports = Main;