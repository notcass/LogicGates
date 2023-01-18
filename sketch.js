/// <reference path="libraries/p5.global-mode.d.ts" />
/**
 *
 *
 *
 */

let board;
const notGate = {
  label: 'not',
  x: 400,
  y: 300,
  inputs: 1,
  outputs: 1,
};

const andGate = {
  label: 'and',
  x: 100,
  y: 100,
  inputs: 2,
  outputs: 1,
};

function setup() {
  createCanvas(800, 600).parent('sketch-holder');
  board = new Board();
  board.makeNewGate(notGate, board);
  board.makeNewGate(andGate, board);
}

function draw() {
  background(100);

  board.handleGates();
  // board.handleInputs();
}

function keyPressed() {
  if (key === 'q') isLooping() ? noLoop() : loop();
  if (key === 'r') redraw();
  if (key === '1') console.log(board.isDrawingConnections());
}

function mousePressed() {
  board.addConnection(mouseX, mouseY);
}

function mouseReleased() {
  board.mouseUp();
}
