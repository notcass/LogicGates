// <reference path="../libraries/p5.global-mode.d.ts" />

/**
 *                 A clone of the program in the youtube video
 *             "Exploring How Computers Work", by Sebastian Lague.
 *                      https://youtu.be/QZwneRb-zqA
 *
 */

let board;
let DEBUG;
const COLORS = {};

function setup() {
  createCanvas(1366, 768).parent('sketch-holder');
  const sketch = document.querySelector('#sketch-holder');
  const buttons = document.querySelector('#button-holder');
  sketch.insertAdjacentElement('beforeend', buttons);

  COLORS['WHITE'] = color(255);
  COLORS['BLACK'] = color(0);
  COLORS['DARK_BLUE'] = color(14, 15, 60);
  COLORS['DARKER_BLUE'] = color(14, 15, 35);
  COLORS['ON_RED'] = color(255, 50, 0);
  COLORS['DARKER_GREY'] = color(18);
  COLORS['DARK_GREY'] = color(45);
  COLORS['LIGHT_GREY'] = color(130);
  resetSketch();
}

function resetSketch() {
  board = new Board(width, height, 3, 1);
  // board.createGate('NOT');
  // board.createGate('AND');

  //========== DEBUGGING/TESTING ==========
  DEBUG = new Debug();
  DEBUG.LOAD_SETUP(11);
}

function draw() {
  board.runApp();
  DEBUG.SHOW_NODE_INFO();
  DEBUG.SHOW_GATE_INFO();
}

function keyPressed() {
  if (key === 'q') isLooping() ? noLoop() : loop();
  if (key === 'w') redraw();

  //DEBUGGING
  if (key === '!') DEBUG.LOAD_SETUP(1);
  if (key === '@') DEBUG.LOAD_SETUP(2);
  if (key === '#') DEBUG.LOAD_SETUP(3);
  if (key === '$') DEBUG.LOAD_SETUP(4);
  if (key === '%') DEBUG.LOAD_SETUP(5);
  if (key === '^') DEBUG.LOAD_SETUP(6);
  if (key === '&') DEBUG.LOAD_SETUP(7);

  // if (key === 'k') DEBUG.CREATE_SETUP_FROM_BOARD_STATE();
  // if (key === 't') board.createGateFromState();
  // if (key === 'a') console.log(frameRate());
  // if (key === 'r') board.init();
  if (key === 'm') console.log(mouseX, mouseY);
}

function mousePressed() {
  board.mouseDown();
}

function mouseReleased() {
  board.mouseUp();
}
