// <reference path="../libraries/p5.global-mode.d.ts" />

/**
 *                 A clone of the program in the youtube video
 *             "Exploring How Computers Work", by Sebastian Lague.
 *                      https://youtu.be/QZwneRb-zqA
 *
 */

let board;
let DEBUG;
const buttons = [];
const COLORS = {};
let can, apple;

function setup() {
  createCanvas(1366, 768).parent('sketch-holder');
  can = document.querySelector('#sketch-holder');
  apple = document.querySelector('#button-holder');
  can.insertAdjacentElement('beforeend', apple);

  COLORS['WHITE'] = color(255);
  COLORS['BLACK'] = color(0);
  COLORS['DARK_BLUE'] = color(14, 15, 60);
  COLORS['DARKER_BLUE'] = color(14, 15, 35);
  COLORS['ON_RED'] = color(255, 50, 0);
  COLORS['DARKER_GREY'] = color(18);
  COLORS['DARK_GREY'] = color(45);
  resetSketch();
}

function resetSketch() {
  board = new Board(width, height, 2, 2);
  board.createGate('NOT', board, 0);
  board.createGate('AND', board, 2);

  //========== DEBUGGING/TESTING ==========
  DEBUG = new Debug();
  // DEBUG.LOAD_SETUP(7);
}

function draw() {
  board.runApp();
  // DEBUG.SHOW_NODE_INFO();
  // DEBUG.SHOW_GATE_INFO();
}

function keyPressed() {
  // if (key === 'q') isLooping() ? noLoop() : loop();
  // if (key === 'w') redraw();

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
  // if (key === 'r') resetSketch();
  // if (key === 'm') console.log(mouseX, mouseY);
}

function mousePressed() {
  board.mouseDown();
}

function mouseReleased() {
  board.mouseUp();
}
