class Board {
  constructor(_w, _h) {
    this.x = _w / 25;
    this.y = _h / 13;
    this.w = _w - this.x * 2;
    this.h = _h - this.y * 2;
    this.powerSources = 2;
    this.power = [];
    this.outputs = 1;
    this.gates = []; // All gates on the board
    this.draggingGate = null; // Boolean
    this.sourceNode = null; // Node we are drawing from
    this.tempNode = null; // Temp var holder
    this.allNodes = []; // All nodes on all gates in one array
  }

  setupPower() {
    // Power sources
    let divider = height / (this.powerSources + 1);

    for (let i = 0; i < this.powerSources; i++) {
      let x = this.x;
      let y = divider + i * divider;
      this.power.push(new PowerNode(this, 'POWER', 'POWER', x, y));
    }
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
    this.handlePower();
  }

  makeNewGate(label, x, y) {
    let newGate = new Gate(label, x, y);
    this.gates.push(newGate);

    // Keep track of all input/output nodes on the board
    this.allNodes = [...this.power];
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
        gate.x = constrain(gate.x, this.x, this.w + this.x - gate.w);
        gate.y = constrain(gate.y, this.y, this.h + this.y - gate.h);

        gate.show(); // Ensure gate that is being moved is always drawn last (on top)
      }
    }
  }

  handlePower() {
    // console.log(this.power[0].x, this.power[0].y);

    // Draw
    this.power.forEach((p) => {
      p.show();
    });
  }

  addConnection(x, y) {
    this.gates.forEach((g) => {
      g.addConnection(x, y);
    });
  }

  mousePressed() {
    for (const node of this.allNodes) {
      // If we click on a node
      if (node.isClicked(mouseX, mouseY)) {
        // Clear any lines to or from node
        this.removeLines(node);

        // Start drawing it
        node.drawing = true;
        this.sourceNode = node;

        break;
      }
    }
  }

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
