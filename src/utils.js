function log () {
  console.log.apply(console.log, arguments)
}

function makeId (length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

class TimeTrial {
  constructor(time) {
    const me = this;
    const getTime = function() {
      const now = time || new Date();
    
      if (!me.last) me.last = now
      return [now, me.last ? now - me.last : 0]
    }

    getTime();

    return getTime;
  }
}

function average (array) {
  array.reduce((a, b) => a + b) / array.length
}

module.exports = {
  TimeTrial,
  log,
  makeId,
  average
}