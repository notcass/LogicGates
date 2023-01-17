class Node {
  constructor(parent, type, size) {
    this.parent = parent;
    this.type = type; // Input, Output, Power, ?
    this.size = size;
    // this.x = parent.x;
    // this.y = parent.y + this.size;
    this.x = 0;
    this.y = 0;
    this.drawing = false;
  }

  show() {
    switch (this.type) {
      case 'INPUT-UPPER':
        this.x = this.parent.x;
        this.y = this.parent.y + this.size;
        break;
      case 'INPUT-LOWER':
        this.x = this.parent.x;
        this.y = this.parent.y + this.parent.h - this.size;
        break;
    }
    // this.x = this.parent.x;
    // this.y = this.parent.y + this.size;

    circle(this.x, this.y, this.size);
    if (this.drawing) {
      stroke(255);
      strokeWeight(2);
      line(this.x, this.y, mouseX, mouseY);
    }
  }
}
