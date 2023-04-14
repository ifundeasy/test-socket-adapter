require('dotenv').config();

const { env, argv } = process
const { io } = require('socket.io-client');
const { log, makeId, TimeTrial } = require('./utils')


class Main {
  done = false;
  data = [];

  constructor({ PORT, USERID } = {}) {
    const me = this;
    const getTime = new TimeTrial()
    const usePort = PORT || argv[2] || env.SOCKET_PORT || 3000;
    const userId = USERID || argv[3] || makeId(8);
    const host = 'ws://localhost:' + usePort;
  
    let socketId, disconnect = true;
    const socket = io(host);
    
    socket.once('connect', (error) => {
      disconnect = false
      socketId = socket.id;
    
      let [now, gap] = getTime();
      const meta = { socketId, event: 'connect', took: gap, data: error };
      me.data.push(meta)
      log(now, JSON.stringify(meta));
    
      socket.emit('FOO', userId);
    });
    
    socket.on('connect', (error) => {
      if (disconnect) {
        let [now, gap] = getTime();
        const meta = { socketId, event: 'reconnect', took: gap, data: error };
        log(now, JSON.stringify(meta));

        if (!me.data[1]) {
          me.data[0] = meta;
          socket.emit('FOO', userId);
        }
      }
    });
    
    socket.on('BAR', (data) => {
      let [now, gap] = getTime();
      const meta = { socketId, event: 'BAR', took: gap, data };
      me.data.push(meta)
      log(now, JSON.stringify(meta));

      this.done = true
      // socket.disconnect()
    })
    
    socket.on('disconnect', (error) => {
      disconnect = true

      const meta = { socketId, event: 'disconnect', took: 0, data: error };
      log(new Date(), JSON.stringify(meta));
    })
  }
}

if (!module.parent) new Main();
else module.exports = Main;