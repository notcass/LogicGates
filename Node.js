class Node {
  constructor(_parent, _type, _subtype, _x, _y) {
    this.parent = _parent;
    this.type = _type; // output, input
    this.subType = _subtype; // INPUT_UPPER,INPUT_CENTER INPUT_LOWER, OUTPUT, POWER, ?
    this.size = _parent.cSize ?? 30;
    this.x = _x ?? 0;
    this.y = _y ?? 0;
    this.drawing = false;
    this.prev; // Previous Node
    this.next; // Next Node
    this.partner = null;
  }

  show() {
    switch (this.subType) {
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
    fill(255);
    circle(this.x, this.y, this.size);
    if (this.drawing) {
      stroke(255);
      strokeWeight(2);
      line(this.x, this.y, mouseX, mouseY);
    }

    if (this.partner != null) {
      stroke(255, 100, 0);
      strokeWeight(2);
      line(this.x, this.y, this.partner.x, this.partner.y);
    }
  }

  isClicked(mouseX, mouseY) {
    let d = dist(mouseX, mouseY, this.x, this.y);
    return d < this.size / 2;
  }
}
