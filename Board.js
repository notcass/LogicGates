/**
 *  TODO:
 *    -Add side panels to hold power sources, buttons, etc
 *    -"Create Gate from board state" feature
 */
class Board {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.powerSources = 2;
    this.outputs = 1;
    this.gates = [];
    this.draggingGate = null;
  }

  makeNewGate(label, x, y) {
    let newGate = new Gate(label, x, y);
    this.gates.push(newGate);
  }

  handleGates() {
    // Show Gates
    this.gates.forEach((g) => {
      g.show();
    });

    // Drag gates
    if (!this.isDrawingConnections()) {
      if (this.draggingGate == null) {
        if (mouseIsPressed) {
          this.gates.forEach((g, index) => {
            if (mouseX > g.x && mouseX < g.x + g.w) {
              if (mouseY > g.y && mouseY < g.y + g.h) {
                this.draggingGate = index;
              }
            }
          });
        }
      } else {
        let gate = this.gates[this.draggingGate];
        gate.x = mouseX - gate.w / 2;
        gate.y = mouseY - gate.h / 2;
        gate.show(); // Ensure gate that is being moved is always drawn last (on top)
      }
    }
  }

  addConnection(mouseX, mouseY) {
    this.gates.forEach((g) => {
      g.addConnection(mouseX, mouseY);
    });
  }

  mouseUp() {
    console.log('mouseUp()');
    // Stop moving gates
    this.draggingGate = null;

    // Stop drawing inputs
    this.gates.forEach((g) => {
      g.inputs.forEach((i) => (i.drawing = false));
    });
  }

  // Check all inputs and outputs on all gates to see if drawing any connections
  isDrawingConnections() {
    let a = false;
    this.gates.forEach((gate) => {
      gate.inputs.forEach((input) => {
        if (input.drawing) a = true;
      });
    });
    return a;
  }
}
