class Gate {
    constructor(_args, _parent, _id) {
        this.label = _args.label;
        this.x = _args.x ?? 0;
        this.y = _args.y ?? 0;
        this.w = 150; // 150;
        this.h = 100; //90;
        this.cSize = 29;
        this.parent = _parent;
        this.id = _id;
        this.truthTable = _args.truthTable;
        this.gateInputs = new Array(_args.gateInputs);
        this.gateOutputs = new Array(_args.gateOutputs);
        this.layer = -1;
        this.gatesToTheLeftCounts = {};
        this.gateCounter = 0;
        this.stickingToMouse = false;
        this.init();
    }

    areNodesFull() {
        return this.areInputsFull() && this.areOutputsFull();
    }

    areInputsFull() {
        return this.gateInputs.every((inpNode) => inpNode.prev);
    }

    areOutputsFull() {
        return this.gateOutputs.every((outNode) => outNode.next.length > 0);
    }

    init() {
        const input_count = this.gateInputs.length;
        const output_count = this.gateOutputs.length;
        const max_nodes =
            input_count > output_count ? input_count : output_count;

        // Setup variable gate Sizing
        textSize(30);
        this.h = 50 + (max_nodes - 1) * 30; // max_nodes * 40;
        this.w = textWidth(this.label) + 55;

        // Inputs
        for (let i = 0; i < input_count; i++) {
            this.gateInputs[i] = new Node(
                this,
                'GATE_INPUT',
                null,
                null,
                this.parent.getNextNodeId(),
                i
            );
        }

        // Outputs
        for (let i = 0; i < output_count; i++) {
            this.gateOutputs[i] = new Node(
                this,
                'GATE_OUTPUT',
                null,
                null,
                this.parent.getNextNodeId(),
                i
            );
        }
    }

    show() {
        if (this.stickingToMouse) {
            this.stickToMouse();
        }

        // Box
        stroke(255);
        // fill(18);
        fill(14, 16, 60);
        strokeWeight(1);
        rect(this.x, this.y, this.w, this.h, 8);

        // Text
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(30);

        text(this.label, this.x + this.w / 2, this.y + this.h / 2);

        // Setup gate's input and output positions
        const input_count = this.gateInputs.length;
        const output_count = this.gateOutputs.length;
        const inDivider = this.h / (input_count + 1);
        const outDivider = this.h / (output_count + 1);

        this.gateInputs.forEach((inpNode, index) => {
            inpNode.x = this.x;
            inpNode.y = this.y + inDivider + index * inDivider;
            inpNode.show();
        });

        this.gateOutputs.forEach((outNode, index) => {
            outNode.x = this.x + this.w;
            outNode.y = this.y + outDivider + index * outDivider;
            outNode.show();
        });
    }

    stickToMouse() {
        const x =
            mouseX > this.parent.x && mouseX < this.parent.x + this.parent.w;
        const y =
            mouseY > this.parent.y && mouseY < this.parent.y + this.parent.h;

        if (mouseIsPressed || (!x && !y)) {
            this.x = mouseX - this.w / 2;
            this.y = mouseY - this.h / 2;
        } else {
            this.stickingToMouse = false;
        }
    }

    // Compute gate logic from truth table
    evaluateLogic() {
        // Only check if all the nodes are occupied
        if (this.areInputsFull() && this.areOutputsFull()) {
            // Create string representation of current inputs
            let inputPermutation = '';
            this.gateInputs.forEach((inpNode) => {
                inputPermutation += inpNode.power ? '1' : '0';
            });

            // Access corresponding output value from this gates truth table
            let outputStr = this.truthTable[inputPermutation];

            this.gateOutputs.forEach((outNode, index) => {
                let outputBool = outputStr.charAt(index) === '1';
                // For each node connected to this GATE_OUTPUT
                outNode.setPower(outputBool);
                outNode.next.forEach((connectedNode) => {
                    // Propagate the power value

                    connectedNode.setPower(outputBool);
                });
            });
        } else {
            this.gateOutputs.forEach((outNode) => {
                outNode.next.forEach((connectedNode) => {
                    connectedNode.setPower(false);
                });
            });
        }
    }

    setLayer() {
        DEBUG.msg(
            '%c============ COUNTING GATES TO THE LEFT ============',
            'color: #d44'
        );
        DEBUG.msg(
            `%c========== STARTING GATE:%c ${this.label} ${this.id} %c========== `,
            `color: #f80`,
            'color: #fff',
            'color: #f80'
        );

        // Count gates to the start for each input node on this gate
        this.gateInputs.forEach((inpNode) => {
            DEBUG.msg(
                `%c========== STARTING NODE: ${inpNode.id} ==========`,
                `color: #a3e`
            );
            this.gatesToTheLeftCounts[inpNode.id] = 0;

            this.goDownNodeChain(inpNode, this, inpNode);
        });

        DEBUG.msg(
            '%c====================================================',
            'color: #d44'
        );
        // Set layer property to the amount of gates through the LONGEST path to our INPUTS
        this.layer = Math.max(...Object.values(this.gatesToTheLeftCounts));
    }

    goDownNodeChain(node, startGate, startNode) {
        DEBUG.msg(
            `%cHead is at node ${node.id}. Type is ${node.type}`,
            'color: #09f'
        );

        // BASE CASE - If we've reached an INPUT node, aka a POWER SOURCE
        if (node.type === 'INPUT') {
            DEBUG.msg('REACHED THE START!');

            if (this.gateCounter > this.gatesToTheLeftCounts[startNode.id]) {
                this.gatesToTheLeftCounts[startNode.id] = this.gateCounter;
            }
            this.gateCounter = 0;

            // If we're on the right side of a gate aka a GATE_OUTPUT
        } else if (node.type === 'GATE_OUTPUT') {
            this.gateCounter++;
            node.parent.gateInputs.forEach((inpNode) => {
                this.goDownNodeChain(inpNode, startGate, startNode);
            });

            // If we're on the left side of a gate aka a GATE_INPUT
        } else if (node.type === 'GATE_INPUT') {
            this.goDownNodeChain(node.prev, startGate, startNode);
        }
    }
}
