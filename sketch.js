/// <reference path="libraries/p5.global-mode.d.ts" />
/**
 *
 *
 *
 */

let board;

function setup() {
  createCanvas(800, 600).parent('sketch-holder');
  board = new Board();
  board.makeNewGate('not', 400, 300);
}

function draw() {
  background(100);

  board.handleGates();
  // board.handleInputs();
}

function keyPressed() {
  if (key === 'q') isLooping() ? noLoop() : loop();
  if (key === 'r') redraw();
}

function mousePressed() {
  board.addConnection(mouseX, mouseY);
}

function mouseReleased() {
  board.stopDrawingInputs();
}

function areDrawingInputs(gates) {
  gates.every((g) => [g.inputs[0].drawing]);
}
