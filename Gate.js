class Gate {
  constructor(args, parent) {
    this.label = args.label;
    this.x = args.x;
    this.y = args.y;
    this.w = 100;
    this.h = 70;
    this.cSize = 20;
    this.parent = parent;

    this.inputs = new Array(args.inputs);
    this.outputs = [];
    this.setupIO();
    // console.table(this);
  }

  setupIO() {
    // Inputs
    const input_labels = ['INPUT_UPPER', 'INPUT_CENTER', 'INPUT_LOWER'];
    const input_count = this.inputs.length;

    // Output
    this.outputs.push(new Node(this, 'OUTPUT'));

    switch (input_count) {
      case 1:
        this.inputs[0] = new Node(this, input_labels[1]); // Center
        break;
      case 2:
        this.inputs[0] = new Node(this, input_labels[0]); // Upper
        this.inputs[1] = new Node(this, input_labels[2]); // Lower
        break;
      case 3:
        this.inputs[0] = new Node(this, input_labels[0]); // Upper
        this.inputs[0] = new Node(this, input_labels[1]); // Center
        this.inputs[0] = new Node(this, input_labels[2]); // Lower
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

  addConnection(mouseX, mouseY) {
    if (mouseIsPressed) {
      this.inputs.forEach((i) => {
        if (i.isClicked(mouseX, mouseY)) {
          i.drawing = true;
        }
      });
    }
  }
  //TODO: Refactoring this below v to this above ^

  // addConnection(mouseX, mouseY) {
  //   if (mouseIsPressed) {
  //     let dUpper = dist(mouseX, mouseY, this.x, this.y + this.cSize);
  //     let dLower = dist(mouseX, mouseY, this.x, this.y + this.h - this.cSize);
  //     let dOutput = dist(mouseX, mouseY, this.x + this.w, this.y + this.h / 2);

  //     // Clicked on upper
  //     if (dUpper < this.cSize / 2) {
  //       // set upper input to draw
  //       this.inputs[0].drawing = true;
  //     } else {
  //       //IF DRAWING, TRY TO CONNECT??
  //       if (this.inputs[0].drawing) {
  //       }
  //       this.inputs[0].drawing = false;
  //     }

  //     // Clicked on lower
  //     if (dLower < this.cSize / 2) {
  //       this.inputs[1].drawing = true;
  //     } else {
  //       this.inputs[1].drawing = false;
  //     }

  //     // Clicked on Output
  //     if (dOutput < this.cSize / 2) {
  //       this.outputs[0].drawing = true;
  //     } else {
  //       this.outputs[0].drawing = false;
  //     }
  //   }
  // }
}
