class Board {
  constructor(_w, _h) {
    this.x = _w / 25;
    this.y = _h / 13;
    this.w = _w - this.x * 2;
    this.h = _h - this.y * 2;
    this.inputCount = 2;
    this.inputs = [];
    this.powerButtons = [];
    this.outputCount = 1;
    this.outputs = [];
    this.gates = []; // All gates on the board
    this.draggingGate = null; // Boolean
    this.sourceNode = null; // Node we are drawing from
    this.tempNode = null; // Temp var holder
    this.allNodes = []; // All nodes on all gates in one array
    this.setupIO();
  }

  setupIO() {
    // Input Nodes
    let divider = height / (this.inputCount + 1);
    for (let i = 0; i < this.inputCount; i++) {
      let x = this.x + 30;
      let y = divider + i * divider;
      this.inputs.push(new InputNode(this, 'INPUT', x, y));

      // Power Button
      let button = {
        x: x - 50,
        y: y,
        attachedNode: this.inputs[i],
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
    divider = height / (this.outputCount + 1);
    for (let i = 0; i < this.outputCount; i++) {
      let x = this.x + this.w;
      let y = divider + i * divider;
      this.outputs.push(new OutputNode(this, 'OUTPUT', x, y));
    }

    this.allNodes.push(...this.inputs, ...this.outputs);
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

  makeNewGate(gateObj, x, y) {
    let newGate = new Gate(gateObj, x, y);
    this.gates.push(newGate);
    this.allNodes.push(...newGate.gateInputs, ...newGate.gateOutputs);
  }

  handleGates() {
    // Show Gates
    this.gates.forEach((g) => {
      g.show();
      g.checkLogic();
    });

    // Drag gates
    if (!this.isDrawingToMouse()) {
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
    // Draw Inputs
    this.inputs.forEach((p) => p.show());
    // Draw board output
    this.outputs.forEach((o) => o.show());
  }

  mouseDown() {
    // For each node
    for (const node of this.allNodes) {
      // If we are hovering one
      if (node.mouseHovering(mouseX, mouseY)) {
        // Clear any other lines to or from the node
        this.removeConnections(node);

        // Set drawing flag
        node.drawingToMouse = true;
        this.sourceNode = node;
        break;
      }
    }
    // Power Buttons
    for (const p of this.powerButtons) {
      p.clicked(mouseX, mouseY);
    }
  }

  // Stop any mouse movement animations
  mouseUp() {
    this.draggingGate = null;

    this.stopDrawingToMouse();

    // If we're currently drawing a line from a source node to mouse
    if (this.sourceNode) {
      this.connectNodes();
    }
  }

  stopDrawingToMouse() {
    // Stop drawing lines from GATE_INPUTS and GATE_OUTPUTS
    this.gates.forEach((g) => {
      g.gateInputs.forEach((i) => (i.drawingToMouse = false));
      g.gateOutputs.forEach((o) => (o.drawingToMouse = false));
    });
    //Stop drawing lines from INPUTS and OUTPUTS
    this.inputs.forEach((p) => (p.drawingToMouse = false));
    this.outputs.forEach((o) => (o.drawingToMouse = false));
  }

  // This function accounts for what order you connect nodes in, so that power is always
  // flowing from output -> input
  connectNodes() {
    // Get the node that is under the cursor and set it to target
    let targetNode;
    for (const n of this.allNodes) {
      if (n.mouseHovering(mouseX, mouseY)) {
        targetNode = n;
        break;
      }
    }

    // If target node isn't null, isn't on the same gate, and isn't same type
    if (targetNode) {
      let diffParent = targetNode.parent != this.sourceNode.parent;
      let diffParentType = targetNode.parent.constructor.name != this.sourceNode.parent.constructor.name;
      // console.log(`diffParent ${diffParent}`);
      // console.log(`diffParentType ${diffParentType}`);

      // Will this expression work?
      if (diffParent || diffParentType) {
        // Remove any other lines
        this.removeConnections(targetNode);

        //FIXME:
        // Attach nodes together.
        // If the sourceNode isn't an INPUT or GATE_INPUT, make the sourceNode
        // the first in the chain. This way power always flows right

        // if (this.sourceNode.type != 'INPUT' && this.sourceNode.type != 'GATE_INPUT') {
        //   console.log('first');

        //   targetNode.prev = this.sourceNode;
        //   this.sourceNode.next = targetNode;
        // } else {
        //   console.log('second');
        //   this.sourceNode.prev = targetNode;
        //   targetNode.next = this.sourceNode;
        // }

        // FIX ATTEMPTS
        // console.log(targetNode.type);

        let sourceType = this.sourceNode.type;
        let targetType = targetNode.type;
        // Clicking from inputs
        if (sourceType.includes('INPUT')) {
          console.log('Clicked from Input');

          if (targetType.includes('INPUT')) {
            console.log('Left to Right 1');
            targetNode.prev = this.sourceNode;
            this.sourceNode.next = targetNode;
          } else {
            console.log('Right to Left 1');
            targetNode.next = this.sourceNode;
            this.sourceNode.prev = targetNode;
          }
          // Clicking from outputs
        } else {
          console.log('Clicked from Output');

          if (targetType.includes('INPUT')) {
            console.log('Left to Right 2');
            targetNode.prev = this.sourceNode;
            this.sourceNode.next = targetNode;
          } else {
            console.log('Right to Left 2');
            targetNode.next = this.sourceNode;
            this.sourceNode.prev = targetNode;
          }
        }
      }
    }
  }

  // Clear any lines between node and next
  removeConnections(nodeA) {
    for (const nodeB of this.allNodes) {
      if (nodeB != nodeA) {
        if (nodeB.next == nodeA || nodeB.prev == nodeA) {
          // // Turn off power if it's not a Input
          [nodeA, nodeB].forEach((n) => {
            // if (n.subType != 'POWER') n.power = false;
            if (n.type != 'INPUT') n.power = false;
          });

          nodeB.next = null;
          nodeA.next = null;
          break;
        }
      }
    }
  }

  // Returns TRUE as soon as we find a node that IS being drawn from
  isDrawingToMouse() {
    return !this.allNodes.every((n) => !n.drawingToMouse);
  }
  // Check all inputs and outputs on all gates to see if drawing any connections
  isDrawingToMouseOld() {
    let a = false;
    for (const n of this.allNodes) {
      if (n.drawingToMouse) {
        a = true;
        break;
      }
    }
    return a;
  }
}
