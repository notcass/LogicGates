class Gate {
  constructor(label, x, y) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.w = 100;
    this.h = 70;
    this.cSize = 20;
  }


  show() {
    // Box
    fill(48);
    rect(this.x, this.y, this.w, this.h);

    // Text
    fill(255);
    textAlign(LEFT, TOP)
    textSize(26);
    text(this.label, this.x + 30, this.y + 23);

    // Inputs
    circle(this.x, this.y + this.cSize, this.cSize);
    circle(this.x, this.y + this.h - this.cSize, this.cSize);

    // Output
    circle(this.x + this.w, this.y + this.h / 2, this.cSize);

  }


  drag(mouseX, mouseY) {
    if (mouseIsPressed) {
      if (mouseX > this.x && mouseX < this.x + this.w) {
        if (mouseY > this.y && mouseY < this.y + this.h) {
          this.x = mouseX - this.w / 2;
          this.y = mouseY - this.h / 2;
        }
      }
    }

  }
}