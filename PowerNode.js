class PowerNode extends Node {
  constructor(_parent, _type, _subtype, _x, _y) {
    super(_parent, _type, _subtype, _x, _y);
  }

  isClicked(mouseX, mouseY) {
    let d = dist(mouseX, mouseY, this.x, this.y);
    return d < this.size / 2;
  }

  test() {
    console.log('Delete this whenever :)');
  }
}
