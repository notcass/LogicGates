/// <reference path="../libraries/p5.global-mode.d.ts" />
/**
 *                 A clone of the program in the youtube video
 *             "Exploring How Computers Work", by Sebastian Lague.
 *                      https://youtu.be/QZwneRb-zqA
 *
 *
 *  TODO:
 *    STRUCTURE:
 *      DONE --Dynamic placement of nodes onto gates for when we have custom gates
 *
 *      DONE --Add incrementing ID numbers to gates and nodes for easier debugging/identifying
 *            -Bonus: Create automatic incrementing value without a global var
 *
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
 *      --Draw smooth/curved lines (😳😩) between nodes, like in the reference video
 *      --Add side panels to hold power sources, buttons, etc
 *      --Add Buttons "Create", "AND", "NOT"
 *          -Create: Creates a gate from the board state
 *          -AND:    Spawns an AND gate
 *          -NOT:    Spawns a NOT gate
 *      --Add text input area to name new gates
 *
 *    RANDOM:
 *      --Go back in commit history and find the bug that leaves burn-in on my laptop screen for a minute or so
 *        when a node flashes red and white on the same frame somehow 🤔
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
  // DEBUG();
}

function resetSketch() {
  // board = new Board(width, height, 2, 2);
  // board.makeNewGate(notGate, board, 0);
  // board.makeNewGate(notGate, board, 1);
  // board.gates[1].y = 300;
  // board.makeNewGate(andGate, board, 2);
  DEBUG_SETUPS(2);
}

function draw() {
  background(100);
  board.runApp();
}

function keyPressed() {
  if (key === 'q') isLooping() ? noLoop() : loop();
  if (key === 'w') redraw();
  // DEBUGGING
  if (key === '1') DEBUG_SETUPS(1);
  if (key === '2') DEBUG_SETUPS(2);
  if (key === '3') board.startBoardStater();
  if (key === '4') board.findConnections();
  if (key === 'a') console.log(frameRate());
  if (key === 'r') resetSketch();
  if (key === 'm') console.log(mouseX, mouseY);
}

function mousePressed() {
  board.mouseDown();
}

function mouseReleased() {
  board.mouseUp();
}

function DEBUG_SETUPS(n) {
  if (n === 1) {
    board = new Board(width, height, 2, 2);
    const a = board.allNodes;
    board.makeNewGate(notGate, board, 0);
    board.makeNewGate(notGate, board, 1);
    board.gates[1].y = 350;

    // Two AND gates
    a[0].next = a[4];
    a[4].prev = a[2];

    a[5].next = a[2];
    a[2].prev = a[5];

    a[1].next = a[6];
    a[6].prev = a[1];

    a[7].next = a[3];
    a[3].prev = a[7];
  }

  if (n === 2) {
    board = new Board(width, height, 3, 2);
    const a = board.allNodes;
    board.makeNewGate(notGate, board, 0);
    board.makeNewGate(andGate, board, 1);
    board.gates[1].x = 200;
    board.gates[1].y = 350;

    // 3 inputs
    // One NOT and one AND gate
    a[0].next = a[5];
    a[5].prev = a[0];

    a[6].next = a[3];
    a[3].prev = a[6];

    a[1].next = a[7];
    a[7].prev = a[1];

    a[9].next = a[4];
    a[4].prev = a[9];

    a[2].next = a[8];
    a[8].prev = a[2];
  }
}
