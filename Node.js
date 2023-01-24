class Node {
  constructor(_parent, _type, _subtype, _x, _y) {
    this.parent = _parent;
    this.type = _type; // output, input
    this.subType = _subtype; // INPUT_UPPER,INPUT_CENTER INPUT_LOWER, OUTPUT, POWER, ?
    this.size = _parent.cSize ?? 40;
    this.x = _x ?? 0;
    this.y = _y ?? 0;
    this.drawing = false;
    this.next = null; // Next Node
    this.partner = null;
    this.poweredOn = false;
    this.onColor = color(255, 50, 0);
    this.offColor = color(255);
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

    this.setColors();
    noStroke();
    circle(this.x, this.y, this.size);

    if (this.drawing) {
      this.setColors();
      strokeWeight(2);
      line(this.x, this.y, mouseX, mouseY);
    }

    if (this.partner != null) {
      this.setColors();
      strokeWeight(2);
      line(this.x, this.y, this.partner.x, this.partner.y);
    }
  }

  setColors() {
    this.poweredOn ? stroke(this.onColor) : stroke(this.offColor);
    this.poweredOn ? fill(this.onColor) : fill(this.offColor);
  }

  isClicked(mouseX, mouseY) {
    let d = dist(mouseX, mouseY, this.x, this.y);
    return d < this.size / 2;
  }
  switchState() {
    this.poweredOn = !this.poweredOn;
    if (this.next) this.next.switchState();
  }
}
class PowerNode extends Node {
  constructor(_parent, _type, _subtype, _x, _y) {
    super(_parent, _type, _subtype, _x, _y);
  }
}

class OutputNode extends Node {
  constructor(_parent, _type, _subtype, _x, _y) {
    super(_parent, _type, _subtype, _x, _y);
  }
  calculateState() {}
}
