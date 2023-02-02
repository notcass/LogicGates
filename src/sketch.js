/// <reference path="../libraries/p5.global-mode.d.ts" />
/**
 *  TODO:
 *    STRUCTURE:
 *      DONE --Dynamic placement of nodes onto gates for when we have custom gates
 *
 *      --Add incrementing ID numbers to gates and nodes for easier debugging/identifying
 *          -Bonus: Create automatic incrementing value without a global var
 *      --Dynamic text sizing on gate labels
 *
 *      --Change the way we draw to the mouse.
 *         Instead of node objects having a drawingToMouse boolean,
 *         put that property onto the board object as an integer. The int
 *         corresponds to the node that we are drawing to's ID. If
 *         we aren't drawing, maybe it's -1? See "Add ID's" todo above.
 *
 *      --Generate a truth table from the board state
 *         Only consider inputs that connect all the way to the output
 *         Use this to create a new gate from the board state?
 *
 *
 *
 *    FEATURES:
 *      --Add side panels to hold power sources, buttons, etc
 *      --Add Buttons "Create", "AND", "NOT"
 *          -Create: Creates a gate from the board state
 *          -AND:    Spawns an AND gate
 *          -NOT:    Spawns a NOT gate
 *      --Add text input area to name new gates
 *
 *  FIXME:
 *      --Add gates always being drawn on top when dragging them
 *
 *
 *  CLEAN:
 *    --Combine gate inputs, gate outputs, board power into one data structure.
 *    Currently, we loop through gates.gateInputs and gates.outputs any
 *    time we need to handle power connections.
 *    --Learn "Extends" keyword? make PowerNode class that extends node?
 *    --Make separate input/output nodes that extend node?
 *
 */

let board;
const notGate = {
  label: 'NOT',
  x: 200,
  y: 200,
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
  resetSketch();
}

function resetSketch() {
  board = new Board(width, height, 2, 1);
  board.makeNewGate(notGate, board, 0);
  board.makeNewGate(notGate, board, 1);
  board.gates[1].y = 300;
  board.makeNewGate(andGate, board, 2);
}

function draw() {
  background(100);
  board.runApp();
}

function keyPressed() {
  if (key === 'q') isLooping() ? noLoop() : loop();
  if (key === 'w') redraw();
  // DEBUGGING
  if (key === '1') console.log(mouseX, mouseY);
  if (key === '2') console.log(board.allNodes);
  if (key === '3') board.makeTruthTable();
  if (key === '4') board.findConnections();
  if (key === 'a') console.log(frameRate());
  if (key === 'r') resetSketch();
  if (key === 'f') DEBUG();
}

function mousePressed() {
  board.mouseDown();
}

function mouseReleased() {
  board.mouseUp();
}

function DEBUG() {
  // Connect nodes at the start
  const all = board.allNodes;
  all[0].next = all[3];
  all[3].prev = all[0];

  all[4].next = all[2];
  all[2].prev = all[4];

  // all[4].next = all[7];
  // all[7].prev = all[4];

  // all[9].next = all[2];
  // all[2].prev = all[9];
}
