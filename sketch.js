/// <reference path="libraries/p5.global-mode.d.ts" />
/**
 *
 *
 *
 */

let testG;

let gates = [];

function setup() {
  createCanvas(800, 600).parent('sketch-holder');
  testG = new Gate('not', 400, 300);
  gates.push(testG);
}

function draw() {
  background(100);
  gates.forEach((g) => {
    g.show();
    g.drag(mouseX, mouseY);
  });
}

function keyPressed() {
  if (key === 'q') isLooping() ? noLoop() : loop();
  if (key === 'r') redraw();
}

function showBoard() {
  // Inputs
}
