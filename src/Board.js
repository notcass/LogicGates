class Board {
    // Don't remove this prettier-ignore
    // prettier-ignore
    constructor(w, h, inputs, outputs) {
        this.label = 'Board';
        this.x = w / 25;
        this.y = h / 13;
        this.w = w - this.x * 2;
        this.h = h - this.y * 2;
        this.borderRadius = 8;
        this.inpCount = inputs;
        this.inputs = [];
        this.powerButtons = [];
        this.outCount = outputs;
        this.outputs = [];
        this.gates = []; // All gates on the board
        this.gateIdCounter = 0;
        this.nodeIdCounter = 0;
        this.draggingGate = null; // Boolean
        this.sourceNode = null; // Node we are drawing from
        this.allNodes = []; // All nodes on all gates in one array
        this.maker;
        this.lastMouseClick = 0;
        this.gateTemplates = {
            NOT: {
                label: 'NOT',
                gateInputs: 1,
                gateOutputs: 1,
                truthTable: {
                    '0': '1',
                    '1': '0',
                },
            },
            AND: {
                label: 'AND',
                gateInputs: 2,
                gateOutputs: 1,
                truthTable: {
                    '00': '0',
                    '01': '0',
                    '10': '0',
                    '11': '1',
                },
            },
            NAND: {
                label: 'NAND',
                gateInputs: 2,
                gateOutputs: 1,
                truthTable: {
                    '00': '1',
                    '01': '1',
                    '10': '1',
                    '11': '0',
                },
            },
            OR: {
                label: 'OR',
                gateInputs: 2,
                gateOutputs: 1,
                truthTable: {
                    '00': '0',
                    '01': '1',
                    '10': '1',
                    '11': '1',
                },
            },


        };
        this.setupEventListeners();
        this.init();
    }

    init() {
        this.gateIdCounter = 0;
        this.nodeIdCounter = 0;
        this.inputs = [];
        this.outputs = [];
        this.gates = [];
        this.allNodes = [];
        this.sourceNode = null;
        // Input Nodes
        let divider = height / (this.inpCount + 1);
        for (let i = 0; i < this.inpCount; i++) {
            let x = this.x + 30;
            let y = divider + i * divider;
            this.inputs.push(
                new InputNode(this, 'INPUT', x, y, this.getNextNodeId(), i)
            );

            // CLEAN: add a createpowerbutton function
            // Power Button
            const button = {
                x: x - 47,
                y: y,
                attachedNode: this.inputs[i],
                radius: 16,
                show: function () {
                    fill(45);
                    strokeWeight(3);
                    stroke(155);
                    line(this.x, this.y, this.x + 40, this.y);
                    stroke(155);
                    fill(45);
                    circle(this.x, this.y, this.radius * 2);
                },
                clicked: function (x, y) {
                    let d = dist(x, y, this.x, this.y);
                    if (d < this.radius) {
                        // POWER ON NODE
                        this.attachedNode.switchState();
                    }
                },
            };
            this.powerButtons.push(button);
        }

        // Output Nodes
        divider = height / (this.outCount + 1);
        for (let i = 0; i < this.outCount; i++) {
            let x = this.x + this.w;
            let y = divider + i * divider;
            this.outputs.push(
                new OutputNode(this, 'OUTPUT', x, y, this.getNextNodeId(), i)
            );
        }

        this.allNodes.push(...this.inputs, ...this.outputs);
    }

    runApp() {
        background(COLORS.DARKER_GREY);

        // Show borders
        strokeWeight(2);
        stroke(205);
        fill(40);
        // fill(14, 15, 40);
        rect(this.x, this.y, this.w, this.h, this.borderRadius);

        //Power
        this.handleIO();
        // Gates
        this.handleGates();
        // Connections
        this.allNodes.forEach((node) => {
            node.evalPower();
        });
    }

    createGateFromState(label) {
        label = label.toUpperCase();
        if (label.length > 0) {
            this.maker = new GateCreator(this);
            if (this.maker.inpCount > 0) {
                const newTable = this.maker.makeTable();
                DEBUG.msg(newTable);

                const newGate = {
                    label: label,
                    truthTable: newTable,
                    gateInputs: this.maker.inpCount,
                    gateOutputs: this.maker.outCount,
                };
                this.createGate(newGate);

                // ADD NEW BUTTON TO BOTTOM OF BOARD
                this.createButton(newGate.label);

                // Clear Board after making new gate
                this.init();
            } else {
                DEBUG.msg('No valid inputs to make a new gate from.');
            }
        }
    }

    createGate(gate, sticky) {
        if (this.gateTemplates[gate]) {
            // Found gate in templates
            gate = this.gateTemplates[gate];
        } else {
            // Add gate to templates
            this.gateTemplates[gate.label] = gate;
        }
        let newGate = new Gate(gate, this, this.getNextGateId());
        if (sticky) newGate.stickingToMouse = true;
        this.gates.push(newGate);
        this.allNodes.push(...newGate.gateInputs, ...newGate.gateOutputs);
    }

    handleGates() {
        // Show Gates
        this.gates.forEach((g) => {
            g.show();
            // Only evaluate gate logic when mouse is pressed
            if (mouseIsPressed) {
                g.evaluateLogic();
            }
        });

        // Drag gates
        if (!this.isDrawingToMouse()) {
            if (this.draggingGate == null) {
                if (mouseIsPressed) {
                    this.gates.forEach((g, index) => {
                        if (mouseX > g.x && mouseX < g.x + g.w) {
                            if (mouseY > g.y && mouseY < g.y + g.h) {
                                this.draggingGate = index;
                            }
                        }
                    });
                }
            } else {
                let gate = this.gates[this.draggingGate];

                gate.x = mouseX - gate.w / 2;
                gate.y = mouseY - gate.h / 2;
                gate.x = constrain(gate.x, this.x, this.w + this.x - gate.w);
                gate.y = constrain(gate.y, this.y, this.h + this.y - gate.h);

                // gate.show(); // Ensure gate that is being moved is always drawn last (on top)
            }
        }
    }

    handleIO() {
        // Draw power buttons
        this.powerButtons.forEach((pb) => pb.show());
        // Draw Inputs/Outputs
        this.allNodes.forEach((n) => n.show());
        // Draw trash square
        strokeWeight(10);
        stroke(255, 27, 39, 80);
        fill(255, 27, 39, 80);
        rect(this.x + this.w - 100, this.y + 4, 95, 100, this.borderRadius);
    }

    mouseDown() {
        // For each node
        for (const node of this.allNodes) {
            // If we are hovering one
            if (node.mouseHovering(mouseX, mouseY)) {
                // If node is a GATE_INPUT or OUTPUT or we Double Clicked
                const doubleClicked = frameCount - this.lastMouseClick < 20;
                if (
                    node.type === 'GATE_INPUT' ||
                    node.type === 'OUTPUT' ||
                    doubleClicked
                ) {
                    this.removeConnections(node);
                }

                // Set drawing flag
                node.drawingToMouse = true;
                this.sourceNode = node;
                this.lastMouseClick = frameCount;
                break;
            }
        }
        // Power Buttons
        for (const p of this.powerButtons) {
            p.clicked(mouseX, mouseY);
        }
    }

    // Stop any mouse movement animations
    mouseUp() {
        this.stopDrawingToMouse();

        // If we're currently drawing a line from a source node to mouse
        if (this.sourceNode) {
            this.connectNodes();
        }

        // Trash square coords
        let x = this.x + this.w - 50;
        let y = this.y + 50;

        // If mouse is in the trash square, prune the dragging gate if there is one
        if (dist(mouseX, mouseY, x, y) < 100) {
            this.pruneGate(this.draggingGate);
        }

        this.draggingGate = null;
        this.gates.forEach((g) => {
            g.evaluateLogic();
        });
    }

    pruneGate(index) {
        let gate = this.gates[index];
        if (gate) {
            // Stop drawing anything to that gate
            [...gate.gateInputs, ...gate.gateOutputs].forEach((node) => {
                this.removeConnections(node);
            });

            // Removing gate/node objects from relevant arrays
            this.allNodes = this.allNodes.filter(
                (node) => node.parent.id !== gate.id
            );
            this.gates = this.gates.filter((g, i) => index !== i);
        }
    }

    stopDrawingToMouse() {
        // Stop drawing lines from GATE_INPUTS and GATE_OUTPUTS
        this.gates.forEach((g) => {
            g.gateInputs.forEach((inpNode) => (inpNode.drawingToMouse = false));
            g.gateOutputs.forEach(
                (outNode) => (outNode.drawingToMouse = false)
            );
        });
        //Stop drawing lines from INPUTS and OUTPUTS
        this.allNodes.forEach((node) => (node.drawingToMouse = false));
    }

    connectNodes() {
        // Get the node that is under the cursor and set it to target
        let targetNode;
        for (const n of this.allNodes) {
            if (n.mouseHovering(mouseX, mouseY)) {
                targetNode = n;
                break;
            }
        }

        // If target node isn't null, isn't on the same gate, and isn't same type

        if (targetNode) {
            const sourceType = this.sourceNode.type;
            const targetType = targetNode.type;

            function canConnect(sourceNodeType, targetNodeType) {
                if (sourceNodeType === 'INPUT') {
                    return targetNodeType === 'GATE_INPUT';
                }

                if (sourceNodeType === 'GATE_INPUT') {
                    return (
                        targetNodeType === 'INPUT' ||
                        targetNodeType === 'GATE_OUTPUT'
                    );
                }

                if (sourceNodeType === 'GATE_OUTPUT') {
                    return (
                        targetNodeType === 'OUTPUT' ||
                        targetNodeType === 'GATE_INPUT'
                    );
                }

                if (sourceNodeType === 'OUTPUT') {
                    return targetNodeType === 'GATE_OUTPUT';
                }
            }

            // Make sure we aren't connecting two incompatible nodes, (two inputs, two outputs, etc..)
            const validTypes = canConnect(sourceType, targetType);
            const diffParent = this.sourceNode.parent != targetNode.parent;

            if (validTypes && diffParent) {
                // Stop drawing to this node so we can overwrite it with the new connection

                if (targetType === 'GATE_INPUT' || targetType === 'OUTPUT') {
                    this.removeConnections(targetNode);
                }

                // If the sourceNode isn't an INPUT or GATE_INPUT, make the sourceNode
                // the first in the chain. This way power always flows right.
                // (aka node.next is always valid)
                if (sourceType === 'INPUT' || sourceType === 'GATE_OUTPUT') {
                    // Drawing connection from the 'left'
                    this.sourceNode.next.push(targetNode);
                    targetNode.prev = this.sourceNode;
                } else {
                    // Drawing connection from the 'right'
                    this.sourceNode.prev = targetNode;
                    targetNode.next.push(this.sourceNode);
                }
            }
        }
    }

    removeConnections(node) {
        if (node.next.length > 0) {
            node.next.forEach((connectedNode) => {
                connectedNode.setPower(false);
                connectedNode.prev = null;
            });
            node.next = [];
        }

        if (node.prev) {
            if (node.prev.type !== 'INPUT') node.prev.setPower(false);
            if (node.type !== 'INPUT') node.setPower(false);
            // nodeA.prev.next = null;
            node.prev.next = node.prev.next.filter(
                (connectedNode) => connectedNode !== node
            );
            node.prev = null;
        }
    }

    setupEventListeners() {
        const createText = document.querySelector('#create-gate-input');
        createText.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.createGateFromState(createText.value);
                createText.value = '';
            }
        });

        const btnCreate = document.querySelector('#button-create');
        btnCreate.addEventListener('click', (e) => {
            this.createGateFromState(createText.value);
        });
        const btnSave = document.querySelector('#button-save');
        btnSave.addEventListener('click', (e) => {
            this.saveTemplates();
        });

        const btnLoad = document.querySelector('#button-load');
        btnLoad.addEventListener('click', (e) => {
            this.loadTemplates();
        });

        for (const gate in this.gateTemplates) {
            this.createButton(this.gateTemplates[gate].label);
        }
    }

    createButton(label) {
        const newBtn = document.createElement('div');
        const str = `<button class="button" id="button-${label}" type="button">
        <span class="text">${label}</span>
        </button>`;
        newBtn.innerHTML = str;

        const btnHolder = document.querySelector('#button-holder');
        btnHolder.insertAdjacentElement('beforeend', newBtn.firstChild);

        btnHolder.lastChild.addEventListener('mousedown', (e) => {
            this.createGate(label, true);
        });
    }

    // Returns TRUE as soon as we find a node that IS being drawn from
    isDrawingToMouse() {
        return !this.allNodes.every((node) => !node.drawingToMouse);
    }

    getNextNodeId() {
        return this.nodeIdCounter++;
    }

    getNextGateId() {
        return this.gateIdCounter++;
    }

    getNodeFromId(id) {
        let a = null;
        for (const n of this.allNodes) {
            if (n.id === id) {
                a = n;
                break;
            }
        }
        return a;
    }

    // TODO: Do this later as a bonus:
    encodeTemplate() {
        // Before I found out about using stringify to store objects into localStorage,
        // I was going to encode the truth table and number of inputs and outputs into a string
        // the first 2 digits would be inputs and outputs, then it would be the truth table laid out like to
        // 21000010100111 would be an AND gate, 2 inputs, 1 output, then 00: 0, 01: 0, 10: 0, 11: 1
        // localStorage.setItem('AND',  '21000010100111' );
    }

    // Saves templates to localStorage if they don't exist there yet
    saveTemplates() {
        console.log('Saving Templates...');
        for (const t in this.gateTemplates) {
            localStorage.setItem(t, JSON.stringify(this.gateTemplates[t]));
        }
    }

    // Loads localStorage templates into current templates if they don't exist there yet
    loadTemplates() {
        console.log('Loading Templates...');

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = JSON.parse(localStorage[key]);

            // If item in storage is a gate?
            if (value.truthTable) {
                // And it doesn't exist in templates
                if (this.gateTemplates[key] == undefined) {
                    // Add to templates
                    this.gateTemplates[key] = value;
                    // Setup button
                    this.createButton(key);
                }
            }
        }
    }
}
