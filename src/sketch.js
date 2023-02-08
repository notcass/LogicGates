// <reference path="../libraries/p5.global-mode.d.ts" />

/**
 *                 A clone of the program in the youtube video
 *             "Exploring How Computers Work", by Sebastian Lague.
 *                      https://youtu.be/QZwneRb-zqA
 *
 */

let board;
let DEBUG;
let gm; // TESTING GATE MAKER
let GLOB;
const buttons = [];
const COLORS = {};
let can, apple;

// TODO: Move these gate object literals to board?
//prettier-ignore
const notGate = {
  label: 'NOT',
  x: 200,
  y: 200,
  gateInputs: 1,
  gateOutputs: 1,
  truthTable: {
    '0': '1',
    '1': '0',
  },
};

//prettier-ignore
const andGate = {
  label: 'AND',
  x: 500,
  y: 270,
  gateInputs: 2,
  gateOutputs: 1,
  truthTable: {
    '00': '0',
    '01': '0',
    '10': '0',
    '11': '1',
  },
};

function setup() {
  // createCanvas(1366, 768).parent('sketch-holder');
  createCanvas(800, 600).parent('sketch-holder');
  can = document.querySelector('#sketch-holder');
  apple = document.querySelector('#button-holder');
  let input = document.querySelector('#input');
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

let inps;

function resetSketch() {
  board = new Board(width, height, 2, 2);
  board.makeNewGate(notGate, board, 0);
  board.makeNewGate(andGate, board, 2);

  //========== DEBUGGING/TESTING ==========
  DEBUG = new Debug();
  // DEBUG.LOAD_SETUP(7);

  gm = new GateFromBoardMaker(board);

  gm.computeOutputs();
}

function draw() {
  board.runApp();
  DEBUG.SHOW_NODE_INFO();
  DEBUG.SHOW_GATE_INFO();
}

function keyPressed() {
  if (key === 'q') isLooping() ? noLoop() : loop();
  if (key === 'w') redraw();
  // DEBUGGING
  if (key === '1') DEBUG.LOAD_SETUP(1);
  if (key === '2') DEBUG.LOAD_SETUP(2);
  if (key === '3') DEBUG.LOAD_SETUP(3);
  if (key === '4') DEBUG.LOAD_SETUP(4);
  if (key === '5') DEBUG.LOAD_SETUP(5);
  if (key === '6') DEBUG.LOAD_SETUP(6);
  if (key === '7') DEBUG.LOAD_SETUP(7);
  if (key === 'c') DEBUG.CREATE_SETUP_FROM_BOARD_STATE();
  if (key === 't') board.createGateFromState();
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
