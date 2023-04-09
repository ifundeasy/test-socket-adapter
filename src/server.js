require('dotenv').config();

const { Server } = require("socket.io");
const adapter = require('./adapter');
const log = require('./log');
const { env } = process;

const io = new Server();

io.on("connection", (socket) => {
  const start = new Date();
  const socketId = socket.client.id;
  log('0 (ms)', `socketId=${socketId} event=connect`)

  socket.on("disconnect", (reason) => {
    log(`socketId=${socketId} event=disconnect`, reason)
  });

  socket.on('FOO', (data) => {
    const stop = new Date();

    log(`${stop - start} (ms)`, `socketId=${socketId} event=FOO`, data)
    socket.emit('BAR', {
      ...data,
      message: 'bar'
    });
  })
});

const useAdapter = process.argv[2] || env.SOCKET_ADAPTER || 'memory';
const usePort = process.argv[3] || env.SOCKET_PORT || 3000;

const main = async () => {
  log('Socket using adapter:', useAdapter)

  if (adapter[useAdapter]) {
    io.adapter(await adapter[useAdapter]());
  }
  
  io.listen(usePort);
  log('Socket listen on port:', usePort)
}

main();