class Board {
  constructor(_w, _h) {
    this.x = _w / 25;
    this.y = _h / 13;
    this.w = _w - this.x * 2;
    this.h = _h - this.y * 2;
    this.powerNodeCount = 2;
    this.powerNodes = [];
    this.powerButtons = [];
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
      let x = this.x + 30;
      let y = divider + i * divider;
      this.powerNodes.push(new PowerNode(this, 'OUTPUT', 'POWER', x, y));

      // Power Button
      let button = {
        x: x - 50,
        y: y,
        attachedNode: this.powerNodes[i],
        radius: 13,
        show: function () {
          fill(255);
          stroke(255);
          strokeWeight(2);
          line(this.x, this.y, this.x + 40, this.y);
          noStroke();
          circle(this.x, this.y, this.radius * 2);
        },
        clicked: function (x, y) {
          let d = dist(x, y, this.x, this.y);
          if (d < this.radius) {
            // POWER ON NODE
            this.attachedNode.switchState();
          }
        },
      };
      this.powerButtons.push(button);
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
    // Connections
    this.allNodes.forEach((n) => {
      n.evalPower();
    });
  }

  makeNewGate(label, x, y) {
    let newGate = new Gate(label, x, y);
    this.gates.push(newGate);
    this.allNodes.push(...newGate.inputs, ...newGate.outputs);
  }

  makeNewGateTest(label, x, y) {}

  handleGates() {
    // Show Gates
    this.gates.forEach((g) => {
      g.show();

      g.checkLogic();
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

        // gate.show(); // Ensure gate that is being moved is always drawn last (on top)
      }
    }
  }

  handleIO() {
    // Draw power buttons
    this.powerButtons.forEach((pb) => pb.show());
    // Draw power
    this.powerNodes.forEach((p) => p.show());
    // Draw board output
    this.outputNodes.forEach((o) => o.show());

    // Draw powerConnections
    // this.powerNodes.forEach((pn) => {
    //   // console.log(pb);
    //   if (pn.next && pn.power) {
    //     // pn.next.switchState();
    //     console.log('here');
    //   }
    // });
  }

  mouseDown() {
    // All Nodes
    for (const node of this.allNodes) {
      // If we click on a node
      if (node.isClicked(mouseX, mouseY)) {
        // Clear any other lines to or from node
        this.removeLines(node);

        // Set drawing flag
        node.drawing = true;
        this.sourceNode = node;
        break;
      }
    }
    // Power Buttons
    for (const p of this.powerButtons) {
      p.clicked(mouseX, mouseY);
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
          if (this.sourceNode.type != 'INPUT') {
            this.sourceNode.next = targetNode;
            targetNode.prev = this.sourceNode;
          } else {
            targetNode.next = this.sourceNode;
            this.sourceNode.prev = targetNode;
          }
        }
      }
    }
  }

  //TESTING
  //TODO: decide which one to keep. Not even sure if the top one is bug free 🤷‍♂️
  removeLines(nodeA) {
    if (nodeA.next) {
      // Power switch off
      if (nodeA.subType != 'POWER') {
        nodeA.power = false;
      }
      nodeA.next.power = false;

      // Line removal
      nodeA.next.prev = null;
      nodeA.next = null;
    }

    if (nodeA.prev) {
      // Power switch off
      if (nodeA.subType != 'POWER') {
        nodeA.power = false;
      }
      // nodeA.prev.power = false;

      // Line removal
      nodeA.prev.next = null;
      nodeA.prev = null;
    }
  }

  // Clear any lines between node and next
  removeLinesOriginal(nodeA) {
    for (const nodeB of this.allNodes) {
      if (nodeB != nodeA) {
        if (nodeB.next == nodeA || nodeB.prev == nodeA) {
          // // Turn off power if it's not a PowerNode
          [nodeA, nodeB].forEach((n) => {
            if (n.subType != 'POWER') n.power = false;
          });

          nodeB.next = null;
          nodeA.next = null;
          break;
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
