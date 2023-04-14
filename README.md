# test-socket-adapter

## Terminal
Socket server
```sh
node src/server.js [socket-port] [adapter]
```

Socket client
```sh
node src/clients.js [socket-port] [max-user] [delay-miliseconds]
```

## Docker
>Edit replication value in ./docker-compose.yaml. Default `replicas: 2`.

Build image
```sh
bash bin/build.sh
```

Start services
```sh
bash bin/deploy.sh
```

Stop services
```sh
bash bin/remove.sh
```

## Test case
> `scenario: single thread`

> In this test case Redis/MongoDB/RabbitMQ runs on same local machine under docker. Docker resource allocation is `4 Core`, `4GB RAM`, and `2GB Swap`.

### Socket Server
Using terminal command:
```sh
# socket server allocated in 1GB memory
node --max-old-space-size=1024 src/server.js 3000 <adapter>
```

### Socket Client

Client scenario
```text
N-client connect in concurrent;

For every connection, once it connected, client emiting `FOO` event;

Socket server will listen then emit (reply) with `BAR` event.

Also, n-client keep connected after listen `BAR` event, no disconnect handling.
```

Using terminal command:
```sh
# Connect to socket 3000 port, 3000 concurrent client with 0 delay connecting each other
node src/clients.js 3000 3000 0
```

1. Performance result without an adapter, just memory (in ms):
```txt
{
  connect: { connection: 3000, min: 4, max: 53169, average: 1602.24 },
  event: { connection: 3000, min: 6, max: 53170, average: 1684.16 }
}
```
2. Performance result with a `Mongodb` adapter (in ms):
    > npm [@socket.io/mongo-adapter](https://www.npmjs.com/package/@socket.io/mongo-adapter)
```txt
{
  connect: { connection: 3000, min: 3, max: 53206, average: 1594.71 },
  event: { connection: 3000, min: 3, max: 53207, average: 1686.04 }
}
```
3. Performance result with a `Redis` adapter (in ms):
    > npm [@socket.io/redis-adapter](https://www.npmjs.com/package/@socket.io/redis-adapter)
```txt
{
  connect: { connection: 3000, min: 10, max: 53168, average: 1830.58 },
  event: { connection: 3000, min: 11, max: 53168, average: 1899.37 }
}
```
3. Performance result with a `RabbitMQ` adapter (in ms):
    > npm [ms-socket.io-adapter-amqp](https://www.npmjs.com/package/ms-socket.io-adapter-amqp)
```txt
{
  connect: { connection: 3000, min: 4, max: 53195, average: 1158.49 },
  event: { connection: 3000, min: 12, max: 53196, average: 1231.92 }
}
```
4. Performance result with a `RabbitMQ` (another lib) adapter (in ms):
    > npm [socket.io-amqp](https://www.npmjs.com/package/socket.io-amqp)
```txt
{
  connect: { connection: 3000, min: 3, max: 53209, average: 1586.27 },
  event: { connection: 3000, min: 4, max: 53210, average: 1652.81 }
}
```