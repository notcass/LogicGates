/// <reference path="libraries/p5.global-mode.d.ts" />
/**
 *  TODO:
 *    FEATURES:
 *      -Draw border of board
 *      -Add power sources and output to board border area
 *      -Drop connection onto node
 *      -Add side panels to hold power sources, buttons, etc
 *      -"Create Gate from board state" feature
 *
 *  FIXME:
 *
 *
 *  CLEAN:
 *    -Combine gate inputs, gate outputs, board power into one data structure.
 *    Currently, we loop through gates.inputs and gates.outputs any
 *    time we need to handle power connections.
 *
 */

let board;
let allNodesTest = [];
const notGate = {
  label: 'not',
  x: 400,
  y: 300,
  inputs: 1,
  outputs: 1,
};

const andGate = {
  label: 'and',
  x: 600,
  y: 300,
  inputs: 2,
  outputs: 1,
};

function setup() {
  createCanvas(800, 600).parent('sketch-holder');
  board = new Board();
  board.makeNewGate(notGate, board);
  board.makeNewGate(andGate, board);
  // board.makeNewGate(andGate, board);
}

function draw() {
  background(100);

  board.handleGates();
  // board.handleInputs();
}

function keyPressed() {
  if (key === 'q') isLooping() ? noLoop() : loop();
  if (key === 'r') redraw();
  if (key === '1') console.log(mouseX, mouseY);
  if (key === '2') {
    board.gates.forEach((gate) => {
      // console.log(`===========Gate===========`);
      // console.log(gate);
      // console.log(`Inputs`);
      // console.log(gate.inputs);
      // console.log(`Outputs`);
      // console.log(gate.outputs);
      gate.inputs.forEach((i) => console.log(i));
      gate.outputs.forEach((o) => console.log(o));
    });
  }

  if (key === 'a') console.log(frameRate());
}

function mousePressed() {
  board.mousePressed();
}

function mouseReleased() {
  board.mouseUp();
}
