/// <reference path="libraries/p5.global-mode.d.ts" />
/**
 *  TODO:
 *    STRUCTURE
 *      -Add incrementing ID numbers to gates and nodes for easier debugging/identifying
 *          -Bonus: Create automatic incrementing value without a global var
 *      -Dynamic text sizing on gate labels
 *
 *    FEATURES:
 *      -Add side panels to hold power sources, buttons, etc
 *      -Add Buttons "Create", "AND", "NOT"
 *          -Create: Creates a gate from the board state
 *          -AND:    Spawns an AND gate
 *          -NOT:    Spawns a NOT gate
 *      -Add text input area to name new gates
 *
 *  FIXME:
 *      -Add gates always being drawn on top when dragging them
 *
 *
 *  CLEAN:
 *    -Combine gate inputs, gate outputs, board power into one data structure.
 *    Currently, we loop through gates.gateInputs and gates.outputs any
 *    time we need to handle power connections.
 *    -Learn "Extends" keyword? make PowerNode class that extends node?
 *    -Make separate input/output nodes that extend node?
 *
 */

let board;
const notGate = {
  label: 'NOT',
  x: 200,
  y: 270,
  gateInputs: 1,
  gateOutputs: 1,
};

const andGate = {
  label: 'AND',
  x: 500,
  y: 270,
  gateInputs: 2,
  gateOutputs: 1,
};

function setup() {
  // createCanvas(1366, 768).parent('sketch-holder');
  createCanvas(800, 600).parent('sketch-holder');
  board = new Board(width, height);
  board.makeNewGate(notGate, board, 0);
  board.makeNewGate(andGate, board, 1);
}

function draw() {
  background(100);

  board.runApp();
}

function keyPressed() {
  if (key === 'q') isLooping() ? noLoop() : loop();
  if (key === 'r') redraw();
  if (key === '1') console.log(mouseX, mouseY);
  if (key === '2') {
    console.log(board.allNodes);
  }

  if (key === 'a') console.log(frameRate());
}

function mousePressed() {
  board.mouseDown();
}

function mouseReleased() {
  board.mouseUp();
}
