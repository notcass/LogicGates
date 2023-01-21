class Node {
  constructor(parent, type) {
    this.parent = parent;
    this.type = type; // INPUT_UPPER,INPUT_CENTER INPUT_LOWER, OUTPUT, POWER, ?
    this.size = parent.cSize;
    this.x = 0;
    this.y = 0;
    this.drawing = false;
    this.prev; // Previous Node
    this.next; // Next Node
    this.connected = null;
  }

  show() {
    switch (this.type) {
      case 'INPUT_UPPER':
        this.x = this.parent.x;
        this.y = this.parent.y + this.size;
        break;
      case 'INPUT_CENTER':
        this.x = this.parent.x;
        this.y = this.parent.y + this.parent.h / 2;
        break;
      case 'INPUT_LOWER':
        this.x = this.parent.x;
        this.y = this.parent.y + this.parent.h - this.size;
        break;
      case 'OUTPUT':
        this.x = this.parent.x + this.parent.w;
        this.y = this.parent.y + this.parent.h / 2;
        break;
    }
    // this.x = this.parent.x;
    // this.y = this.parent.y + this.size;

    stroke(255);
    circle(this.x, this.y, this.size);
    if (this.drawing) {
      stroke(255);
      strokeWeight(2);
      line(this.x, this.y, mouseX, mouseY);
    }

    if (this.connected != null) {
      stroke(255, 100, 0);
      strokeWeight(2);
      line(this.x, this.y, this.connected.x, this.connected.y);
    }
  }

  isClicked(mouseX, mouseY) {
    let d = dist(mouseX, mouseY, this.x, this.y);
    return d < this.size / 2;
  }
}
