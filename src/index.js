const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8000;

const NanoTimer = require('nanotimer');
const str = require('./test');
const frame1 = require('./frame1');
const frame2 = require('./frame2');
const utils = require('./utils');

const FRAME_GENERATOR_TIME_INTERVAL = '1000m';
const WEBSOCKET_STREAM_RATE = '500m';

const date = new Date();

server.listen(port, () => console.log(`[${date.toUTCString()}] INFO: server listening at port ${port}`));

function assembleFrame(node, frameArray) {
  let frame = `${node}:`;

  frameArray.forEach((pixel, i) => {
    frame += pixel;

    if (i < frameArray.length) {
      frame += ';';
    }
  });

  // console.log('FRAME', frame)
  return frame;
}

function getFrame(time, node) {
  const pixelCount = 120;
  const frameArray = utils.makeAllBlack(pixelCount);

  const cyan = "064,224,208,000";
  const red = "150,000,024,000";
  const tiffanyBlue = "192,216,208,000";
  const tiffBlue2 = "010,186,181,000";
  const white = "000,000,000,255";

  // console.log(`FRAME: ${time}`);

  if (node === 1) {
    // frameArray[time % pixelCount] = "030,050,200,000";
    frameArray[time % pixelCount] = tiffBlue2;
    // frameArray[time % (pixelCount - 1)] = white;
    frameArray[time - 1 % (pixelCount)] = tiffBlue2;
    frameArray[time - 2 % (pixelCount)] = tiffanyBlue;
    frameArray[time - 3 % (pixelCount)] = red;
    frameArray[time - 4 % (pixelCount)] = cyan;
    // frameArray[time % (pixelCount - 6)] = white;
    // frameArray[Math.abs((time % pixelCount) - pixelCount)] = '000,005,005,000';
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
}, '', FRAME_GENERATOR_TIME_INTERVAL);

function frameGenerator(socket, node) {
  socket.emit(getFrame(time.frame, node));
}

let nodes = [];

io.on('connection', (socket) => {
  let nodeNumber = null;
  const ticker = new NanoTimer();
  const tocker = new NanoTimer();

  console.log(`[${date.toUTCString()}] INFO: new websocket connection opened`);
  console.log(`[${date.toUTCString()}] DEBUG: frame generator time interval ${FRAME_GENERATOR_TIME_INTERVAL}`);
  console.log(`[${date.toUTCString()}] DEBUG: websocket stream rate ${WEBSOCKET_STREAM_RATE}`);

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
    nodeNumber = node;

    if (nodes.indexOf(socket) === -1) {
      nodes.push(socket);
      console.log(`[${date.toUTCString()}] INFO: node ${node} connected`);
      ticker.setInterval(frameGenerator, [socket, node], WEBSOCKET_STREAM_RATE);
    } else {
      const date = new Date();
      // console.log(`[${date.toUTCString()}] DEBUG: node ${node} is still connected!!!`);
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
    console.log(`[${date.toUTCString()}] INFO: node ${nodeNumber} disconnected`);
    ticker.clearInterval();
  });
});
