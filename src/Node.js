class Node {
  constructor(_parent, _type, _x, _y, _id, _index) {
    this.parent = _parent;
    this.type = _type; // INPUT, OUTPUT, GATE_INPUT, GATE_OUTPUT
    this.id = _id;
    this.size = _parent.cSize ?? 40;
    this.x = _x ?? 0;
    this.y = _y ?? 0;
    this.index = _index; // The nodes index in it's board's relavent holder array
    this.drawingToMouse = false;
    this.next = null; // Next Node
    this.prev = null; // Prev Node
    this.power = false;
  }

  setPower(bool) {
    this.power = bool;
  }

  switchState() {
    this.power = !this.power;
  }

  evalPower() {
    this.show();
    if (this.type == 'INPUT' || this.type == 'GATE_OUTPUT') {
      if (this.next) {
        this.next.power = this.power;
      }
    }
  }

  show() {
    this.setColors();
    circle(this.x, this.y, this.size);

    // Line from node to mouse
    if (this.drawingToMouse) {
      this.setColors();
      line(this.x, this.y, mouseX, mouseY);
    }

    // Line from node to node
    if (this.next != null) {
      this.setColors();
      line(this.x, this.y, this.next.x, this.next.y);
    }
  }

  setColors() {
    strokeWeight(4);
    this.power ? stroke(COLORS.ON_RED) : stroke(COLORS.WHITE);
    this.power ? fill(COLORS.ON_RED) : fill(COLORS.WHITE);
  }

  mouseHovering(mouseX, mouseY) {
    let d = dist(mouseX, mouseY, this.x, this.y);
    return d < this.size / 2;
  }

  returnNext() {
    if (this.type === 'INPUT' || this.type === 'GATE_OUTPUT') {
      return this.next;
    } else if (this.type === 'GATE_INPUT') {
      return this.parent.gateOutputs[0];
    }
  }
}

// Right now these subclasses are mainly for clearer console logging
// but might find some better use in the future
class InputNode extends Node {
  constructor(parent, type, x, y, id, index) {
    super(parent, type, x, y, id, index);
  }
}

class OutputNode extends Node {
  constructor(parent, type, x, y, id, index) {
    super(parent, type, x, y, id, index);
  }
}
