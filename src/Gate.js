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
    this.colortest = color(140, 0, 50);
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
      let output = this.truthTable[inputPermutation];
      // Set outputs to correct values
      this.gateOutputs.forEach((out, index) => {
        out.power = output.charAt(index) === '1';
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
        this.parent.idCounter(),
        i
      );
    }

    // Output
    for (let i = 0; i < output_count; i++) {
      this.gateOutputs[i] = new Node(
        this,
        'GATE_OUTPUT',
        null,
        null,
        this.parent.idCounter(),
        i
      );
    }
  }

  show() {
    // Box
    stroke(255);
    strokeWeight(1);
    fill(COLORS.DARK_BLUE);

    rect(this.x, this.y, this.w, this.h);

    rect(this.x, this.y, this.w, this.h);

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
}
