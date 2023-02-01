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

    this.gateInputs = new Array(_args.gateInputs);
    this.gateOutputs = new Array(_args.gateOutputs);
    this.init();
  }

  /**
   * Determines gate OUTPUT based on the gates INPUTS
   *
   * TODO: Oh boy
   * This needs be done in a dynamic way so that we can create a
   * new logic gate from a Board state later on.
   *
   *  ---MAYBE we just start by hard programming the 'NOT' and 'AND' gate
   */
  checkLogic() {
    if (this.getInputsFull() && this.getOutputsFull()) {
      // NOT gate logic
      if (this.label === 'NOT') {
        this.gateOutputs[0].power = !this.gateInputs[0].power;
      }

      // AND gate logic
      if (this.label === 'AND') {
        this.gateOutputs[0].power =
          this.gateInputs[0].power && this.gateInputs[1].power;
      }
    }
  }

  getInputsFull() {
    return this.gateInputs.every((input) => input.prev);
  }

  getOutputsFull() {
    return this.gateOutputs.every((output) => output.next);
  }

  init() {
    // Setup Gate I/O
    const input_count = this.gateInputs.length;
    const output_count = this.gateOutputs.length;

    // Inputs
    for (let i = 0; i < input_count; i++) {
      this.gateInputs[i] = new Node(this, 'GATE_INPUT');
    }

    // Output
    for (let i = 0; i < output_count; i++) {
      this.gateOutputs[i] = new Node(this, 'GATE_OUTPUT');
    }
  }

  show() {
    stroke(255);
    strokeWeight(1);
    // Box
    fill(48);
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
