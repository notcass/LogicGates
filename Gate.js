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

    this.inputs = new Array(_args.inputs);
    this.outputs = [];
    this.setupGateIO();
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
      if (this.label === 'not') {
        this.outputs[0].power = !this.inputs[0].power;
      }

      // AND gate logic
      if (this.label === 'and') {
        this.outputs[0].power = this.inputs[0].power && this.inputs[1].power;
      }
    }
  }

  getInputsFull() {
    return this.inputs.every((input) => input.prev);
  }

  getOutputsFull() {
    return this.outputs.every((output) => output.next);
  }

  setupGateIO() {
    // Inputs
    const input_count = this.inputs.length;

    // Output
    this.outputs.push(new Node(this, 'OUTPUT', 'OUTPUT'));

    switch (input_count) {
      case 1:
        this.inputs[0] = new Node(this, 'INPUT', 'INPUT_CENTER'); // Center
        break;
      case 2:
        this.inputs[0] = new Node(this, 'INPUT', 'INPUT_UPPER'); // Upper
        this.inputs[1] = new Node(this, 'INPUT', 'INPUT_LOWER'); // Lower
        break;
      case 3:
        this.inputs[0] = new Node(this, 'INPUT', 'INPUT_UPPER'); // Upper
        this.inputs[0] = new Node(this, 'INPUT', 'INPUT_CENTER'); // Center
        this.inputs[0] = new Node(this, 'INPUT', 'INPUT_LOWER'); // Lower
        break;
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
    text(this.label, this.x + 30, this.y + 23);

    // Inputs
    this.inputs.forEach((i) => {
      i.show();
    });

    // Output
    this.outputs[0].show();
  }
}
