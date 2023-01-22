class Board {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.powerSources = 2;
    this.outputs = 1;
    this.gates = []; // All gates on the board
    this.draggingGate = null; // Boolean
    this.sourceNode = null; // Node we are drawing from
    this.tempNode = null; // Temp var holder
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

  addConnection(x, y) {
    this.gates.forEach((g) => {
      g.addConnection(x, y);
    });
  }

  // TODO: START HERE
  mousePressed() {
    for (const node of this.allNodes) {
      // If we click on a node
      if (node.isClicked(mouseX, mouseY)) {
        // console.log(node);

        // Clear any lines to or from node
        this.removeLines(node);
        // if (node.partner != null) {
        // node.partner.partner = null;
        // node.partner = null;
        // }

        // Start drawing it
        node.drawing = true;
        this.sourceNode = node;
        // console.log(node);

        break;
      }
    }
  }

  removeLines(toNode) {
    console.log(toNode);

    for (const n of this.allNodes) {
      if (n != toNode) {
        if (n.partner == toNode) {
          n.partner = null;
          toNode.partner = null;
          break;
        }
      }
    }
  }

  mouseUp() {
    // Stop moving gates
    this.draggingGate = null;
    // Stop drawing inputs
    this.gates.forEach((g) => {
      g.inputs.forEach((i) => (i.drawing = false));
      g.outputs.forEach((o) => (o.drawing = false));
    });

    // If we're drawing a line
    if (this.sourceNode) {
      // and our mouse is over a node
      let targetNode;
      for (const n of this.allNodes) {
        if (n.isClicked(mouseX, mouseY)) {
          targetNode = n;
          break;
        }
      }

      // If target node isn't null, isn't on the same gate, and isn't same type
      if (targetNode != null) {
        let diffParent = targetNode.parent != this.sourceNode.parent;
        let diffType = targetNode.type != this.sourceNode.type;

        if (diffParent && diffType) {
          this.removeLines(targetNode);
          // Then attach nodes together
          this.sourceNode.partner = targetNode;
          targetNode.partner = this.sourceNode;
        }
      }
    }
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
