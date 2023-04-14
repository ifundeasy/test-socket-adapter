const Promise = require('bluebird');
const { log } = require('./utils')
const Client = require('./client');

const Clients = {}
const host = 'ws://localhost:' + (process.argv[2] || '3000')
const maxUser = parseInt(process.argv[3] || '1000')
const delay = parseInt(process.argv[4] || '0')
let id = parseInt(process.argv[5] || '0');

const average = array => array.reduce((a, b) => a + b) / array.length;
function getSummary() {
  const connect = Object.values(Clients).map(el => el.data[0]?.took);
  connect.sort((a, b) => a - b)

  const event = Object.values(Clients).map(el => el.data[1]?.took)
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

function Main () {
  log('Socket client test with opts:', { host, maxUser, delay })
  const z = setInterval(() => {
    if (id === maxUser) clearInterval(z)
    else {
      Clients[id] = new Client({ USERID: id })
    };
    id++;
  }, delay)

  setInterval(() => {
    if (Object.values(Clients).length && Object.values(Clients).map(el => el.done).indexOf(false) === -1) {
      log(`Process is done, summary (in ms):`, getSummary())
      process.exit(1)
    }
  }, 3000)
}

Promise.delay(3000).then(Main)

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