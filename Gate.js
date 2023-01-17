class Gate {
  constructor(label, x, y) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.w = 100;
    this.h = 70;
    this.cSize = 20;
    this.inputs = []; // [0] = upper, [1] = lower
    this.inputs[0] = new Node(this, 'INPUT-UPPER', this.cSize);
    this.inputs[1] = new Node(this, 'INPUT-LOWER', this.cSize);

    // List of Nodes
    this.outputs = []; // [0] = upper, [1] = lower
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
    // circle(this.x, this.y + this.cSize, this.cSize);
    // circle(this.x, this.y + this.h - this.cSize, this.cSize);
    this.inputs.forEach((i) => {
      i.show();
    });

    // Output
    // circle(this.x + this.w, this.y + this.h / 2, this.cSize);
  }

  addConnection(mouseX, mouseY) {
    // Upper Node
    // if clicked
    // draw a line to mouse
    // when mouse is released
    // look through power sources and outputs to check for valid nodes to connect
    // Lower Node
    if (mouseIsPressed) {
      let dUpper = dist(mouseX, mouseY, this.x, this.y + this.cSize);
      let dLower = dist(mouseX, mouseY, this.x, this.y + this.h - this.cSize);

      // Clicked on upper
      if (dUpper < this.cSize / 2) {
        // set upper input to draw
        this.inputs[0].drawing = true;
      } else {
        //IF DRAWING, TRY TO CONNECT??
        if (this.inputs[0].drawing) {
        }
        this.inputs[0].drawing = false;
      }

      // Clicked on lower
      if (dLower < this.cSize) {
        this.inputs[1].drawing = true;
      } else {
        this.inputs[1].drawing = false;
      }
    }
  }

  drag(mouseX, mouseY) {
    if (mouseIsPressed && !this.inputs[0].drawing && !this.inputs[1].drawing) {
      if (mouseX > this.x && mouseX < this.x + this.w) {
        if (mouseY > this.y && mouseY < this.y + this.h) {
          this.x = mouseX - this.w / 2;
          this.y = mouseY - this.h / 2;
        }
      }
    }
  }
}
