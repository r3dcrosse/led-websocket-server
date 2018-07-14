const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

const NanoTimer = require('nanotimer');
const str = require('./test');
const frame1 = require('./frame1');
const frame2 = require('./frame2');

server.listen(port, () => console.log(`Server listening at port ${port}`));

function initializePixels(pixelCount) {
  const pixel = ['000', '000', '000', '000'];
  const frameArray = [];

  for (let i = 0; i < pixelCount; i++) {
    frameArray.push([...pixel]);
  }

  return frameArray;
}

function assembleFrame(node, frameArray) {
  let frame = `${node}:`;

  frameArray.forEach((pixel, i) => {
    frame += pixel;

    if (i < frameArray.length) {
      frame += ';';
    }
  });
  // console.log('FRAME', frame);
  return frame;
}

let numberOfNodes = 0;
const nodes = {};

function getFrame(time) {
  const node = 1;
  const pixelCount = 25;
  const frameArray = initializePixels(pixelCount);

  const cyan = "064,224,208,000";
  const red = "150,000,024,000";
  const tiffanyBlue = "192,216,208,000";
  const tiffBlue2 = "010,186,181,000";
  const white = "000,000,000,255";

  frameArray[time % pixelCount] = red;
  frameArray[time % (pixelCount - 1)] = cyan;
  frameArray[time % (pixelCount - 2)] = white;
  frameArray[time % (pixelCount - 3)] = tiffBlue2;
  frameArray[time % (pixelCount - 4)] = tiffanyBlue;

  return assembleFrame(node, frameArray);
}

const time = { frame: 0 };
const timeKeeper = new NanoTimer();
timeKeeper.setInterval(() => {
  console.log('UPDATEDING FRAME TO BE', time.frame);
  time.frame = time.frame + 1;
}, '', '1000m');

function frameGenerator(socket) {
  socket.emit(getFrame(time.frame));
  // socket.emit(getFrame(Date.now()));
  //   console.log('############# sending a frame 1');
  //   socket.emit(frame1);
  //   cycleNum = 0;
  // } else {
  //   console.log('############# sending a frame 2');
  //   socket.emit(frame2);
  //   cycleNum = 1;
  // }
}

io.on('connection', (socket) => {
  const ticker = new NanoTimer();
  // nodes[numberOfNodes] = Date.now();
  // numberOfNodes++;

  // const latencyBetweenNodes = nodes[numberOfNodes - 1] - nodes[numberOfNodes - 2];
  // console.log('LATENCY', latencyBetweenNodes);

  let frameRate = '10m';
  // if (latencyBetweenNodes) {
  //   frameRate = frameRate - latencyBetweenNodes;
  // }

  ticker.setInterval(frameGenerator, [socket], frameRate);
  const date = new Date(Date.now());
  console.log(`[${date.toUTCString()}]: Something connected`);

  socket.on('ping', ({ node }) => {
    // console.log('SENDING BACK ping FOR node', node);
    socket.emit(`${node}p`);
  });

  socket.on('pong', ({ node }) => {
    // console.log('sending pong for node', node);
    socket.emit(`${node}z`);
  });

  socket.on('latency', ({ node, latency }) => {
    // console.log(`latency for node: ${node} | ${latency}ms`);
  })
  //
  // const ping = setInterval(() => {
  //   console.log('SENDING PING')
  //   // socket.emit("{1p");
  // }, 3000);

  socket.on('disconnect', () => {
    console.log('THIS SOCKET Disconnected');
    ticker.clearInterval();
    // clearInterval(ping);
    // socket.broadcast.emit('node disconnected', { node: 1 });
  });
});
