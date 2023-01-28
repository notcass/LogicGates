class Node {
  constructor(_parent, _type, _subtype, _x, _y) {
    this.parent = _parent;
    this.type = _type; // INPUT, OUTPUT
    this.subType = _subtype; // INPUT_UPPER,INPUT_CENTER INPUT_LOWER, OUTPUT, POWER, POWER_OUT
    this.size = _parent.cSize ?? 40;
    this.x = _x ?? 0;
    this.y = _y ?? 0;
    this.drawing = false;
    this.next = null; // Next Node
    this.prev = null; // Prev Node
    this.power = false;
    this.onColor = color(255, 50, 0);
    this.offColor = color(255);
  }

  setPower(bool) {
    this.power = bool;
  }

  switchState() {
    this.power = !this.power;
  }

  evalPower() {
    if (this.subType == 'POWER' || this.subType == 'OUTPUT') {
      if (this.next) {
        this.next.power = this.power;
      }
    }
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

    if (this.next != null) {
      this.setColors();
      strokeWeight(2);
      line(this.x, this.y, this.next.x, this.next.y);
    }
  }

  setColors() {
    this.power ? stroke(this.onColor) : stroke(this.offColor);
    this.power ? fill(this.onColor) : fill(this.offColor);
  }

  isClicked(mouseX, mouseY) {
    let d = dist(mouseX, mouseY, this.x, this.y);
    return d < this.size / 2;
  }

  DEBUGGING() {
    // console.log(this.parent);
    // console.log(this.type);
    // console.log(this.subType);
    // Going to power on nodes with clicks for now, until we get the logic of the gates
    // down.  Then I'll add a power connection after
    if (this.type == 'INPUT' && typeof this.parent != 'Board') {
      this.power = !this.power;
    }
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
}
