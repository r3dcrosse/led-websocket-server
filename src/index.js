const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const str = require('./test');
const frame1 = require('./frame1');
const frame2 = require('./frame2');

server.listen(port, () => console.log(`Server listening at port ${port}`));
let cycleNum = 0;
const frameGenerator = (socket) => setInterval(() => {
  if (cycleNum) {
    console.log('############# sending a frame 1');
    socket.emit(frame1);
    cycleNum = 0;
  } else {
    console.log('############# sending a frame 2');
    socket.emit(frame2);
    cycleNum = 1;
  }
}, 5000);

io.on('connection', (socket) => {
  const date = new Date(Date.now());

  console.log(`[${date.toUTCString()}]: Something connected`)
  socket.on('request show', (data) => {
    socket.broadcast.emit('request show', { show: 'lol' });
  });

  socket.on('messageType', (data) => {
    console.log('GOT HEREEEEEEEEEEEEE')
    console.log(data)
  });

  frameGenerator(socket);

  socket.on('disconnect', () => {
    console.log('THIS SOCKET DISCONNECTEDDDD')
    clearInterval(frameGenerator);
    // socket.broadcast.emit('node disconnected', { node: 1 });
  });
});
