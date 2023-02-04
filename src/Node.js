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
    //======== DEBUG ========
    noStroke();
    fill(255);
    textSize(12);
    text(`${this.type}`, this.x - 20, this.y - 50);
    text(`${this.id}`, this.x - 20, this.y - 65);
    //=============== =======

    this.setColors();
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

  returnNext() {
    if (this.type === 'INPUT' || this.type === 'GATE_OUTPUT') {
      // console.log(this.next);
      return this.next;
    } else if (this.type === 'GATE_INPUT') {
      // console.log(this.parent.gateOutputs[0]);
      return this.parent.gateOutputs[0];
    }
  }
}
class InputNode extends Node {
  constructor(_parent, _type, _x, _y, _id, _index) {
    super(_parent, _type, _x, _y, _id, _index);
  }
}

class OutputNode extends Node {
  constructor(_parent, _type, _x, _y, _id, _index) {
    super(_parent, _type, _x, _y, _id, _index);
  }
}
