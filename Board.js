class Board {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.powerSources = 2;
    this.outputs = 1;
    this.gates = []; // All gates on the board
    this.draggingGate = null; // Boolean
    this.sourceNode = null; // Node we are drawing from
    this.allNodes = []; // All nodes on all gates in one array
  }

  makeNewGate(label, x, y) {
    let newGate = new Gate(label, x, y);
    this.gates.push(newGate);

    // Keep track of all input/output nodes on the board
    this.allNodes = [];
    this.gates.forEach((g) => {
      this.allNodes.push(...g.inputs, ...g.outputs);
    });
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
        gate.x = constrain(gate.x, 0, width - gate.w);
        gate.y = constrain(gate.y, 0, height - gate.h);

        gate.show(); // Ensure gate that is being moved is always drawn last (on top)
      }
    }
  }

  handlePower() {
    // Draw
  }

  addConnection(mouseX, mouseY) {
    this.gates.forEach((g) => {
      g.addConnection(mouseX, mouseY);
    });
  }

  mouseUp() {
    // Stop moving gates
    this.draggingGate = null;
    // Stop drawing inputs
    this.gates.forEach((g) => {
      g.inputs.forEach((i) => (i.drawing = false));
      g.outputs.forEach((o) => (o.drawing = false));
    });
  }

  // Check all inputs and outputs on all gates to see if drawing any connections
  isDrawingConnections() {
    let a = false;
    this.gates.forEach((gate) => {
      gate.inputs.forEach((input) => {
        if (input.drawing) a = true;
      });
      gate.outputs.forEach((output) => {
        if (output.drawing) a = true;
      });
    });
    return a;
  }
}
