const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const str = require('./test');

server.listen(port, () => console.log(`Server listening at port ${port}`));

const frameGenerator = (socket) => setInterval(() => {
  console.log('############# sending a frame');
  socket.emit(str);
}, 100);

io.on('connection', (socket) => {
  const date = new Date(Date.now());

  console.log(`[${date.toUTCString()}]: Something connected`)
  socket.on('request show', (data) => {
    socket.broadcast.emit('request show', { show: 'lol' });
  });

  socket.on('messageType', (data) => {
    console.log('GOT HEREEEEEEEEEEEEE')
    console.log(data)
  })

  frameGenerator(socket);

  socket.on('disconnect', () => {
    console.log('THIS SOCKET DISCONNECTEDDDD')
    clearInterval(frameGenerator);
    // socket.broadcast.emit('node disconnected', { node: 1 });
  });
});
