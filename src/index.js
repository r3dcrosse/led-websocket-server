const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8000;

const NanoTimer = require('nanotimer');
const str = require('./test');
const frame1 = require('./frame1');
const frame2 = require('./frame2');
const utils = require('./utils');

server.listen(port, () => console.log(`Server listening at port ${port}`));

function assembleFrame(node, frameArray) {
  let frame = `${node}:`;

  frameArray.forEach((pixel, i) => {
    frame += pixel;

    if (i < frameArray.length) {
      frame += ';';
    }
  });

  return frame;
}

function getFrame(time, node) {
  const pixelCount = 25;
  const frameArray = utils.makeAllBlack(pixelCount);

  const cyan = "064,224,208,000";
  const red = "150,000,024,000";
  const tiffanyBlue = "192,216,208,000";
  const tiffBlue2 = "010,186,181,000";
  const white = "000,000,000,255";

  // console.log(`FRAME: ${time}`);
  // frameArray[time % (pixelCount + 1)] = red;
  // frameArray[time % (pixelCount - 2)] = white;
  // frameArray[time % (pixelCount - 3)] = tiffBlue2;
  // frameArray[time % (pixelCount - 4)] = tiffanyBlue;
  // frameArray[time % (pixelCount - 6)] = red;
  // frameArray[time % (pixelCount - 7)] = cyan;
  // frameArray[time % (pixelCount - 8)] = white;
  if (node === 1) {
    frameArray[time % pixelCount] = "000,000,000,005";
    frameArray[Math.abs((time % pixelCount) - pixelCount)] = '000,005,005,000';
    // frameArray[(time - 1) % (pixelCount)] = white;
    // frameArray[(time - 2) % (pixelCount)] = tiffBlue2;
    // frameArray[time % (pixelCount - 2)] = "255, 255, 255, 255";
  } else if (node === 2) {
    frameArray[time % pixelCount] = "000,005,005,005";
    frameArray[Math.abs((time % pixelCount) - pixelCount)] = '005,000,000,000';
    // frameArray[(time - 1) % (pixelCount)] = white;
    // frameArray[(time - 2) % (pixelCount)] = "008,049,045,000";
    // frameArray[(time-1) % (pixelCount)] = tiffBlue2;
  }

  return assembleFrame(node, frameArray);
}

const time = { frame: 0 };
const timeKeeper = new NanoTimer();
timeKeeper.setInterval(() => {
  // console.log('UPDATEDING FRAME TO BE', time.frame);
  if (false && time.frame + 1 > 61) {
    time.frame = 1;
  } else {
    time.frame = time.frame + 1;
  }
}, '', '60m');

function frameGenerator(socket, node) {
  socket.emit(getFrame(time.frame, node));
}

let nodes = [];

io.on('connection', (socket) => {
  const ticker = new NanoTimer();
  const tocker = new NanoTimer();

  const websocketStreamRate = '10m';
  const date = new Date();
  console.log(`[${date.toUTCString()}]: Something connected`);

  socket.on('ping', ({ node }) => {
    // console.log('SENDING BACK ping FOR node', node);
    socket.emit(`${node}p`);
  });

  socket.on('pong', ({ node }) => {
    // socket.emit(`${node}z`);
  });

  socket.on('latency', (msg) => {
    // console.log(`latency for node: ${node} | ${latency}ms`);
  });

  socket.on('nodeConnected', ({ node }) => {
    if (nodes.indexOf(socket) === -1) {
      nodes.push(socket);
      console.log('THIS NODE CONNECTED:', node);
      ticker.setInterval(frameGenerator, [socket, node], websocketStreamRate);
    } else {
      const date = new Date();
      console.log(`[${date.toUTCString()}]: Node ${node} is still connected!!!!`);
      // When we get a message that a node is still connected, we should
      // send back a pong so the node can measure the latency
      socket.emit(`${node}z`);
    }
  });

  socket.on('disconnect', () => {
    if (nodes.indexOf(socket) > -1) {
      nodes.splice(socket, 1);
    }
    const date = new Date();
    console.log(`[${date.toUTCString()}]: A socket disconnected.....`);
    ticker.clearInterval();
  });
});
