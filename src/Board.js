class Board {
  constructor(w, h, inputs, outputs) {
    this.x = w / 25;
    this.y = h / 13;
    this.w = w - this.x * 2;
    this.h = h - this.y * 2;
    this.inputCount = inputs;
    this.inputs = [];
    this.powerButtons = [];
    this.outputCount = outputs;
    this.outputs = [];
    this.gates = []; // All gates on the board
    this.nodeIdCounter = 0;
    this.draggingGate = null; // Boolean
    this.sourceNode = null; // Node we are drawing from
    this.allNodes = []; // All nodes on all gates in one array
    this.init();
    // DEBUG
    this.bs;
  }

  // Setup object to help with board state to gate
  startBoardStater() {
    // Create boardstate object to help encapsulate?
    // this.bs = new BoardStater(this);
    // console.log(this.bs.start());

    this.gates.forEach((g) => {
      g.applyLogic();
    });
  }

  init() {
    // Input Nodes
    let divider = height / (this.inputCount + 1);
    for (let i = 0; i < this.inputCount; i++) {
      let x = this.x + 30;
      let y = divider + i * divider;
      this.inputs.push(new InputNode(this, 'INPUT', x, y, this.idCounter(), i));

      // Power Button
      const button = {
        x: x - 50,
        y: y,
        attachedNode: this.inputs[i],
        radius: 13,
        show: function () {
          fill(45);
          stroke(155);
          strokeWeight(3);
          line(this.x, this.y, this.x + 40, this.y);
          stroke(155);
          fill(45);
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
      this.outputs.push(
        new OutputNode(this, 'OUTPUT', x, y, this.idCounter(), i)
      );
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
      g.applyLogic();
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
    // Draw Inputs/Outputs
    this.allNodes.forEach((n) => n.show());
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
    this.allNodes.forEach((n) => (n.drawingToMouse = false));
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
      const sourceType = this.sourceNode.type;
      const targetType = targetNode.type;

      function canConnect(sourceNodeType, targetNodeType) {
        if (sourceNodeType === 'INPUT') {
          return targetNodeType === 'GATE_INPUT';
        }

        if (sourceNodeType === 'GATE_INPUT') {
          return targetNodeType === 'INPUT' || targetNodeType === 'GATE_OUTPUT';
        }

        if (sourceNodeType === 'GATE_OUTPUT') {
          return targetNodeType === 'OUTPUT' || targetNodeType === 'GATE_INPUT';
        }

        if (sourceNodeType === 'OUTPUT') {
          return targetNodeType === 'GATE_OUTPUT';
        }
      }

      // Make sure we aren't connecting two incompatible nodes, (two inputs, two outputs, etc..)
      const validTypes = canConnect(sourceType, targetType);
      const diffParent = this.sourceNode.parent != targetNode.parent;

      if (validTypes && diffParent) {
        // Stop drawing to this node so we can overwrite it with the new connection
        this.removeConnections(targetNode);

        // If the sourceNode isn't an INPUT or GATE_INPUT, make the sourceNode
        // the first in the chain. This way power always flows right.
        // (aka node.next is always valid)
        if (sourceType === 'INPUT' || sourceType === 'GATE_OUTPUT') {
          // Drawing connection from the 'left'
          this.sourceNode.next = targetNode;
          targetNode.prev = this.sourceNode;
        } else {
          // Drawing connection from the 'right'
          this.sourceNode.prev = targetNode;
          targetNode.next = this.sourceNode;
        }
      }
    }
  }

  // Clear any lines coming from node
  removeConnections(nodeA) {
    if (nodeA.next) {
      if (nodeA.next.type !== 'INPUT') nodeA.next.power = false;
      if (nodeA.type !== 'INPUT') nodeA.power = false;
      nodeA.next.prev = null;
      nodeA.next = null;
    }

    if (nodeA.prev) {
      if (nodeA.prev.type !== 'INPUT') nodeA.prev.power = false;
      if (nodeA.type !== 'INPUT') nodeA.power = false;
      nodeA.prev.next = null;
      nodeA.prev = null;
    }
  }

  //TODO: See TODO at top of sketch.js
  // Returns TRUE as soon as we find a node that IS being drawn from
  isDrawingToMouse() {
    return !this.allNodes.every((n) => !n.drawingToMouse);
  }

  idCounter() {
    return this.nodeIdCounter++;
  }
}
