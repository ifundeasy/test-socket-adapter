const Promise = require('bluebird');
const { io } = require('socket.io-client');
const log = require('./log')

let id = 0
const host = 'ws://localhost:' + (process.argv[2] || '3000')
const maxUser = parseInt(process.argv[3] || '1000')
const delay = parseInt(process.argv[4] || '0')
const maxTime = {
  connects: [],
  events: [],
}
const replies = []

const average = array => array.reduce((a, b) => a + b) / array.length;
const getSummary = () => {
  const connect = maxTime.connects.map(el => average(el));
  connect.sort((a, b) => a - b)

  const event = maxTime.events.map(el => average(el))
  event.sort((a, b) => a - b)

  return {
    connect: {
      connection: connect.length,
      min: connect[0],
      max: connect[connect.length - 1],
      average: average(connect)
    },
    event: {
      connection: event.length,
      min: event[0],
      max: event[event.length - 1],
      average: average(event)
    }
  }
}

const through = async (userId = 0) => {
  let socketId;
  const dates = [ new Date() ];
  const socket = io(host);


  socket.once('connect', (error) => {
    dates[1] = new Date()

    socketId = socket.id
    const gap1 = dates[1] - dates[0];
    log(`${gap1} (ms)`, `socketId=${socketId} event=connect`, { userId });
    maxTime.connects[userId] = maxTime.connects[userId] || []
    maxTime.connects[userId].push(gap1)
    replies[userId] = false

    socket.emit('FOO', { userId, message: 'foo' });
    socket.on('BAR', (data) => {
      dates[2] = new Date()

      const gap2 = dates[2] - dates[1];
      log(`${gap2} (ms)`, `socketId=${socketId} event=BAR`, data)
      maxTime.events[userId] = maxTime.events[userId] || []
      maxTime.events[userId].push(gap2)
      replies[userId] = true

      if (replies.length == maxUser && replies.indexOf(false) === -1) {
        log('Process done, summary (in ms):', getSummary())
      }
    })
  });
}

log('Socket client test with opts:', { host, maxUser, delay })
Promise.delay(3000).then(() => {
  const z = setInterval(() => {
    if (id === maxUser) clearInterval(z)
    else through(id);
    id++;
  }, delay)
})

process
  .on('exit', code => log(`Process exited with code: ${code}`))
  .on('SIGTERM', signal => {
    log(`Process force closed by SIGTERM signal=${signal}, summary (in ms):`, getSummary())
    process.exit(0)
  })
  .on('SIGINT', signal => {
    log(`Process force closed by SIGINT signal=${signal}, summary (in ms):`, getSummary())
    process.exit(0)
  })
  .on('uncaughtException', err => {
    log('Uncaught exception at', err)
    log(`Process force closed by uncaughtException message=${err.message}, summary (in ms):`, getSummary())
    process.exit(1)
  })
  .on('unhandledRejection', (err, promise) => {
    log('Unhandled rejection at ', promise)
    log(`Process force closed by unhandledRejection message=${err.message}, summary (in ms):`, getSummary())
    process.exit(1)
  });
