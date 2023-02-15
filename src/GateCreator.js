class GateCreator {
  constructor(parent) {
    this.board = parent;
    this.connectedIO = {
      inputs: [],
      outputs: [],
    };
    this.findConnectedBoardIO();
    this.inpCount = this.connectedIO.inputs.length;
    this.outCount = this.connectedIO.outputs.length;
    this.connectedGates = [];
  }

  makeTable() {
    /* Generate Input Permutations */
    const permStrings = this.generatePermutations();
    let tTable = {};

    /*
        To figure out the correct output for each permutation, we
        need to do the following:
    */

    /* Figure out which gates are fully connected */
    this.connectedGates = [];
    this.connectedIO.inputs.forEach((inpNode) => {
      this.setConnectedGates(inpNode);
    });

    /* Set layers for each gate, then sort them */
    //prettier-ignore
    this.connectedGates.forEach((gate) => {
        gate.setLayer();
      });
    this.connectedGates.sort((a, b) => a.layer - b.layer);

    /* Compute output value for each permutation */
    tTable = this.calcPermutationOutputs(permStrings);
    console.log(tTable);

    return tTable;
  }

  calcPermutationOutputs(permStrings) {
    const tTable = {};
    permStrings.forEach((p) => {
      this.setNodesToPerm(p);
      this.computeOutputsForCurrentInput();

      let outString = '';
      this.connectedIO.outputs.forEach((o) => {
        outString += o.power ? '1' : '0';
      });

      tTable[p] = outString;
    });
    return tTable;
  }

  // STORE ANY GATES THAT ARE FULLY CONNECTED TO INPUT & OUTPUT IN THE ARRAY
  setConnectedGates(input) {
    const current = input;
    const nextNodes = current.returnNext();
    DEBUG.msg(`%c========================================`, 'color: #c3f');
    DEBUG.msg(current);
    DEBUG.msg(`ID: %c${current.id}`, 'color: #f80');
    DEBUG.msg(`Parent: %c${current.parent.label}`, 'color: #0af');
    DEBUG.msg(`Type: %c${current.constructor.name}`, 'color: #0af');
    DEBUG.msg(nextNodes);

    // IF WE FIND A GATE
    if (current.parent instanceof Gate) {
      // IF GATE NEW AND IS FULLY CONNECTED THEN ADD TO THE ARRAY
      const gateIsNew = this.connectedGates.indexOf(current.parent) === -1;

      const gateNodesFull = current.parent.areNodesFull();
      if (gateIsNew && gateNodesFull) {
        this.connectedGates.push(current.parent);
      }
    }

    // IF INPUT.NEXT EXISTS, REPEAT RECURSIVELY
    if (nextNodes) {
      nextNodes.forEach((connectedNode) => {
        this.setConnectedGates(connectedNode);
      });
    }
  }

  // SET THE STATE OF THE BOARD'S NODES TO THE PERMUTATION ARGUMENT
  setNodesToPerm(permutation) {
    const inps = this.connectedIO.inputs;

    for (let i = 0; i < this.inpCount; i++) {
      inps[i].setPower(permutation.charAt(i) === '1' ? true : false);
    }
    this.evalAllNodePower();
  }

  // DETERMINE BOARD OUTPUT FOR THE CURRENT INPUTS
  computeOutputsForCurrentInput() {
    this.connectedGates.forEach((gate) => {
      gate.evaluateLogic();
      this.evalAllNodePower();
    });
  }

  // TRANSFER POWER DOWN THE CHAIN OF ALL NODES
  evalAllNodePower() {
    this.board.allNodes.forEach((n) => n.evalPower());
  }

  // FINDS THE INPUTS AND OUTPUTS THAT ARE CONNECTED
  findConnectedBoardIO() {
    DEBUG.logging = false;
    const connectedIO = {
      inputs: [],
      outputs: [],
    };

    // RECURSIVE FUNCTION FOR NAVIGATING ALL BRANCHES OF CONNECTIONS STARTING FROM AN OUTPUT
    function traverseLeft(nodes, startNode) {
      if (startNode == null) startNode = nodes[0];

      nodes.forEach((connectedNode) => {
        DEBUG.msg(`Looking at ${connectedNode.id}`);

        if (connectedNode.returnPrev()) {
          let prev = connectedNode.returnPrev();
          DEBUG.msg(`PREV:`);
          DEBUG.msg(prev);

          traverseLeft(prev, startNode);
        } else {
          // IF WE REACH THE START, STORE THE INPUT AND OUTPUT
          if (connectedNode.type === 'INPUT') {
            DEBUG.msg('Reached the start/end');

            if (connectedIO.outputs.indexOf(startNode) === -1) {
              connectedIO.outputs.push(startNode);
            }
            if (connectedIO.inputs.indexOf(connectedNode) === -1) {
              connectedIO.inputs.push(connectedNode);
            }
          }
        }
      });
    }

    this.board.outputs.forEach((outNode) => {
      traverseLeft([outNode]);
    });

    this.connectedIO = connectedIO;
    DEBUG.msg(this.connectedIO);
    DEBUG.logging = true;
  }

  generatePermutations() {
    const permsCount = 2 ** this.inpCount;
    const permsStrings = [];

    for (let i = 0; i < permsCount; i++) {
      // CONVERT DECIMAL TO BINARY STRING  5 => 101
      let val = i.toString(2);
      // ADD LEADING ZEROES TO MATCH THE AMOUNT OF INPUTS
      val = val.padStart(this.inpCount, '0');
      // ADD TO ARRAY
      permsStrings.push(val);
    }

    return permsStrings;
  }
}
