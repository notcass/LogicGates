class Gate {
  constructor(_args, _parent, _id) {
    this.label = _args.label;
    this.x = _args.x;
    this.y = _args.y;
    this.w = 100;
    this.h = 70;
    this.cSize = 20;
    this.parent = _parent;
    this.id = _id;
    this.truthTable = _args.truthTable;
    this.gateInputs = new Array(_args.gateInputs);
    this.gateOutputs = new Array(_args.gateOutputs);
    this.gatesToTheLeftCounts = {};
    this.TEST_COUNTER = 0;
    this.init();
  }

  // Compute gate logic from truth table
  applyLogic() {
    // Only check if all the nodes are occupied
    if (this.areInputsFull() && this.areOutputsFull()) {
      // Create string representation of current inputs
      let inputPermutation = '';
      this.gateInputs.forEach((inp) => {
        inputPermutation += inp.power ? '1' : '0';
      });

      // Access corresponding output value from this gates truth table
      let outputStr = this.truthTable[inputPermutation];
      // Set outputs to correct values
      this.gateOutputs.forEach((out, index) => {
        out.power = outputStr.charAt(index) === '1';
      });
    } else {
      this.gateOutputs.forEach((output) => (output.power = false));
    }
  }

  areInputsFull() {
    return this.gateInputs.every((input) => input.prev);
  }

  areOutputsFull() {
    return this.gateOutputs.every((output) => output.next);
  }

  init() {
    // Setup Gate I/O
    const input_count = this.gateInputs.length;
    const output_count = this.gateOutputs.length;

    // Inputs
    for (let i = 0; i < input_count; i++) {
      this.gateInputs[i] = new Node(
        this,
        'GATE_INPUT',
        null,
        null,
        this.parent.getNextNodeId(),
        i
      );
    }

    // Outputs
    for (let i = 0; i < output_count; i++) {
      this.gateOutputs[i] = new Node(
        this,
        'GATE_OUTPUT',
        null,
        null,
        this.parent.getNextNodeId(),
        i
      );
    }
  }

  show() {
    // Box
    stroke(255);
    // fill(18);
    fill(14, 16, 60);
    strokeWeight(1);
    rect(this.x, this.y, this.w, this.h, 8);

    // Text
    fill(255);
    textAlign(LEFT, TOP);
    textSize(26);
    text(this.label, this.x + 22, this.y + 23);

    // Setup gate's input and output positions
    const input_count = this.gateInputs.length;
    const output_count = this.gateOutputs.length;
    const inDivider = this.h / (input_count + 1);
    const outDivider = this.h / (output_count + 1);

    this.gateInputs.forEach((gI, index) => {
      gI.x = this.x;
      gI.y = this.y + inDivider + index * inDivider;
      gI.show();
    });

    this.gateOutputs.forEach((gO, index) => {
      gO.x = this.x + this.w;
      gO.y = this.y + outDivider + index * outDivider;
      gO.show();
    });
  }

  traverseLeft() {
    console.log('%c======================', 'color: #d44');
    console.log(`%cSTARTING GATE: ${this.label} ${this.id}`, `color: #3f0`);
    console.log(this);

    this.gateInputs.forEach((inpNode) => {
      console.log(`%cNODE: ${inpNode.id}`, `color: #a3e`);

      this.goDownNodeChain(inpNode, this, inpNode);
      console.log('%c======================', 'color: deepskyblue');
    });
    console.log(this.gatesToTheLeftCounts);
  }

  goDownNodeChain(node, startGate, startNode) {
    console.log(`Head is at node ${node.id}`);

    const prev = node.prev;
    console.log('prev.type ' + prev.type);

    if (prev.type === 'INPUT') {
      console.log('%cprev.type is INPUT', 'color:red');
      this.TEST_COUNTER++; // Increment one last time?
      this.gatesToTheLeftCounts[startNode.id] = this.TEST_COUNTER;
      this.TEST_COUNTER = 0;
    } else if (prev.type === 'GATE_OUTPUT') {
      // INCREASE THE COUNTER HERE
      this.TEST_COUNTER++;
      console.log(prev.parent);

      prev.parent.gateInputs.forEach((inp) => {
        this.goDownNodeChain(inp, startGate, startNode);
      });
    } else if (prev.type === 'GATE_INPUT') {
      this.TEST_COUNTER++;
      console.log('HERE!!!!!!!!!!!');

      this.goDownNodeChain(prev.prev, startGate, startNode);
    }
  }
}
