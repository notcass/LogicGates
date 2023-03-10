class Node {
    constructor(_parent, _type, _x, _y, _id, _index) {
        this.parent = _parent;
        this.type = _type; // INPUT, OUTPUT, GATE_INPUT, GATE_OUTPUT
        this.id = _id;
        this.size = _parent.cSize ?? 40;
        this.x = _x ?? -500;
        this.y = _y ?? -500;
        this.index = _index; // The nodes index in it's board's relavent holder array
        this.next = []; // Next Node
        this.prev = null; // Prev Node
        this.power = false;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    setPower(bool) {
        if (bool != this.power) {
            this.power = bool;
        }
    }

    switchState() {
        this.power = !this.power;
    }

    switchState() {
        this.power = !this.power;
    }

    setColors() {
        strokeWeight(6);
        this.power ? stroke(COLORS.ON_RED) : stroke(COLORS.LIGHT_GREY);
        this.power ? fill(COLORS.ON_RED) : fill(COLORS.WHITE);
    }

    // IF THE NODE IS A BOARD INPUT OR A GATE OUTPUT
    // THEN SEND THE POWER TO THE NEXT NODE
    evalPower() {
        if (this.type === 'INPUT' || this.type === 'GATE_OUTPUT') {
            if (this.next.length > 0) {
                this.next.forEach((connectionNode) => {
                    if (connectionNode.power !== this.power) {
                        connectionNode.setPower(this.power);
                    }
                });
            }
        }
        this.show();
    }

    show() {
        this.setColors();
        noStroke();
        // fill(255, 0, 255);
        circle(this.x, this.y, this.size);

        // Line from node to node
        if (this.next.length > 0) {
            this.setColors();
            this.next.forEach((nextNode) => {
                line(this.x, this.y, nextNode.x, nextNode.y);
            });
        }
    }

    mouseHovering(mouseX, mouseY) {
        let d = dist(mouseX, mouseY, this.x, this.y);
        return d < this.size / 2;
    }

    returnNext() {
        if (this.type === 'INPUT' || this.type === 'GATE_OUTPUT') {
            return this.next;
        } else if (this.type === 'GATE_INPUT') {
            return this.parent.gateOutputs;
        }
    }

    returnPrev() {
        if (this.type === 'OUTPUT' || this.type === 'GATE_INPUT') {
            if (this.prev != null) {
                return [this.prev];
            } else {
                return null;
            }
        } else if (this.type === 'GATE_OUTPUT') {
            return this.parent.gateInputs;
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
