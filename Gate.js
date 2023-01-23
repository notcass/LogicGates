class Gate {
  constructor(_args, _parent) {
    this.label = _args.label;
    this.x = _args.x;
    this.y = _args.y;
    this.w = 100;
    this.h = 70;
    this.cSize = 20;
    this.parent = _parent;

    this.inputs = new Array(_args.inputs);
    this.outputs = [];
    this.setupIO();
  }

  setupIO() {
    // Inputs
    const input_labels = ['INPUT_UPPER', 'INPUT_CENTER', 'INPUT_LOWER'];
    const input_count = this.inputs.length;

    // Output
    this.outputs.push(new Node(this, 'output', 'OUTPUT'));

    switch (input_count) {
      case 1:
        this.inputs[0] = new Node(this, 'input', input_labels[1]); // Center
        break;
      case 2:
        this.inputs[0] = new Node(this, 'input', input_labels[0]); // Upper
        this.inputs[1] = new Node(this, 'input', input_labels[2]); // Lower
        break;
      case 3:
        this.inputs[0] = new Node(this, 'input', input_labels[0]); // Upper
        this.inputs[0] = new Node(this, 'input', input_labels[1]); // Center
        this.inputs[0] = new Node(this, 'input', input_labels[2]); // Lower
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
