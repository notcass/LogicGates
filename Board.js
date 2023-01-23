class Board {
  constructor(_w, _h) {
    this.x = _w / 25;
    this.y = _h / 13;
    this.w = _w - this.x * 2;
    this.h = _h - this.y * 2;
    this.powerNodeCount = 2;
    this.powerNodes = [];
    this.outputNodeCount = 1;
    this.outputNodes = [];
    this.gates = []; // All gates on the board
    this.draggingGate = null; // Boolean
    this.sourceNode = null; // Node we are drawing from
    this.tempNode = null; // Temp var holder
    this.allNodes = []; // All nodes on all gates in one array
    this.setupIO();
  }

  setupIO() {
    // Power Nodes
    let divider = height / (this.powerNodeCount + 1);
    for (let i = 0; i < this.powerNodeCount; i++) {
      let x = this.x;
      let y = divider + i * divider;
      this.powerNodes.push(new PowerNode(this, 'OUTPUT', 'POWER', x, y));
    }

    // Output Nodes
    divider = height / (this.outputNodeCount + 1);
    for (let i = 0; i < this.outputNodeCount; i++) {
      let x = this.x + this.w;
      let y = divider + i * divider;
      this.outputNodes.push(new OutputNode(this, 'INPUT', 'POWER_OUT', x, y));
    }

    this.allNodes.push(...this.powerNodes, ...this.outputNodes);
  }

  runApp() {
    // Show borders
    strokeWeight(2);
    stroke(155);
    fill(40);
    rect(this.x, this.y, this.w, this.h);

    // Gates
    this.handleGates();
    //Power
    this.handleIO();
  }

  makeNewGate(label, x, y) {
    let newGate = new Gate(label, x, y);
    this.gates.push(newGate);
    this.allNodes.push(...newGate.inputs, ...newGate.outputs);
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
        gate.x = constrain(gate.x, this.x, this.w + this.x - gate.w);
        gate.y = constrain(gate.y, this.y, this.h + this.y - gate.h);

        gate.show(); // Ensure gate that is being moved is always drawn last (on top)
      }
    }
  }

  handleIO() {
    // Draw power
    this.powerNodes.forEach((p) => p.show());
    // Draw board output
    this.outputNodes.forEach((o) => o.show());
  }

  mousePressed() {
    for (const node of this.allNodes) {
      // If we click on a node
      if (node.isClicked(mouseX, mouseY)) {
        // Clear any other lines to or from node
        if (node.type != 'POWER') {
          this.removeLines(node);
        }
        // Start drawing it
        node.drawing = true;
        this.sourceNode = node;
        break;
      }
    }
  }

  // Clear any lines between node and partner
  removeLines(toNode) {
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
    // Stop drawing gate IO
    this.gates.forEach((g) => {
      g.inputs.forEach((i) => (i.drawing = false));
      g.outputs.forEach((o) => (o.drawing = false));
    });
    //Stop drawing board IO
    this.powerNodes.forEach((p) => (p.drawing = false));
    this.outputNodes.forEach((o) => (o.drawing = false));

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
          // Remove any other lines
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
    for (const n of this.allNodes) {
      if (n.drawing) {
        a = true;
        break;
      }
    }
    return a;
  }
}
