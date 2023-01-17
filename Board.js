class Board {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.gates = [];
  }

  makeNewGate(label, x, y) {
    let newGate = new Gate(label, x, y);
    this.gates.push(newGate);
  }

  handleGates() {
    this.gates.forEach((g) => {
      g.show();
      g.drag(mouseX, mouseY);
    });
  }

  addConnection(mouseX, mouseY) {
    this.gates.forEach((g) => {
      g.addConnection(mouseX, mouseY);
    });
  }

  stopDrawingInputs() {
    this.gates.forEach((g) => {
      g.inputs.forEach((i) => (i.drawing = false));
    });
  }
}
