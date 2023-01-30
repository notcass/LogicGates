class Node {
  constructor(_parent, _type, _x, _y) {
    this.parent = _parent;
    this.type = _type; // INPUT, OUTPUT, GATE_INPUT, GATE_OUTPUT
    this.size = _parent.cSize ?? 40;
    this.x = _x ?? 0;
    this.y = _y ?? 0;
    this.drawingToMouse = false;
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
    if (this.type == 'INPUT' || this.type == 'GATE_OUTPUT') {
      if (this.next) {
        this.next.power = this.power;
      }
    }
  }

  show() {
    this.setColors();
    noStroke();

    circle(this.x, this.y, this.size);

    if (this.drawingToMouse) {
      this.setColors();
      line(this.x, this.y, mouseX, mouseY);
    }

    if (this.next != null) {
      this.setColors();
      line(this.x, this.y, this.next.x, this.next.y);
    }
  }

  setColors() {
    strokeWeight(3);
    this.power ? stroke(this.onColor) : stroke(this.offColor);
    this.power ? fill(this.onColor) : fill(this.offColor);
  }

  mouseHovering(mouseX, mouseY) {
    let d = dist(mouseX, mouseY, this.x, this.y);
    return d < this.size / 2;
  }
}
class InputNode extends Node {
  constructor(_parent, _type, _x, _y) {
    super(_parent, _type, _x, _y);
    this.isGateNode = false;
  }
}

class OutputNode extends Node {
  constructor(_parent, _type, _x, _y) {
    super(_parent, _type, _x, _y);
    this.isGateNode = false;
  }
}
