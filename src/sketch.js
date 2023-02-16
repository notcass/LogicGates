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
// Debug/Testing/Delete later
let gm;

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
    board = new Board(width, height, 8, 8);

    //========== DEBUGGING/TESTING ==========
    DEBUG = new Debug();
    // DEBUG.LOAD_SETUP(12);
}

function draw() {
    board.runApp();
    // DEBUG.SHOW_NODE_INFO();
    // DEBUG.SHOW_GATE_INFO();
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

    if (key === 'r') {
    }
    if (key === 't') {
    }
    if (key === 'm') console.log(mouseX, mouseY);
}

function mousePressed() {
    board.mouseDown();
}

function mouseReleased() {
    board.mouseUp();
}

function mouseMoved() {
    // board.mouseMoved();
}
