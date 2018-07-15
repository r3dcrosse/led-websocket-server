function makeAllOneColor(pixelArray, pixelCount) {
  const frameArray = [];

  for (let i = 0; i < pixelCount; i++) {
    frameArray.push([...pixelArray]);
  }

  return frameArray;
}

function makeAllBlack(pixelCount) {
  const blackPixel = ['000', '000', '000', '000'];
  return makeAllOneColor(blackPixel, pixelCount);
}

function makeAllWhite(pixelCount) {
  const whitePixel = ['255', '255', '255', '000'];
  return makeAllOneColor(whitePixel, pixelCount);
}

function makeAllTrueWhite(pixelCount) {
  const trueWhitePixel = ['000', '000', '000', '005'];
  return makeAllOneColor(trueWhitePixel, pixelCount);
}

module.exports.makeAllOneColor = makeAllOneColor;
module.exports.makeAllBlack = makeAllBlack;
module.exports.makeAllWhite = makeAllWhite;
module.exports.makeAllTrueWhite = makeAllTrueWhite;
