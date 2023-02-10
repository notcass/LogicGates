class GateFromBoardMaker {
  constructor(parent) {
    this.board = parent;
    this.connectedNodes = this.findConnections();
    this.inpCount = this.connectedNodes.inputs.length;
    this.outCount = this.connectedNodes.outputs.length;
    this.connectedGates = [];
  }

  // Setup possible permutations, create truth table
  makeTable() {
    const perms = this.generatePermutations();
    const tTable = {};

    // For each input permutation
    perms.forEach((p) => {
      // Set the board nodes to the permutation
      this.setNodesToPerm(p);

      // Propagate power to outputs
      this.computeOutputs();

      // Then examine the outputs
      let outString = '';
      this.connectedNodes.outputs.forEach((o) => {
        // Add outupts to the end of the perm string and insert into truth table
        outString += o.power ? '1' : '0';
      });
      tTable[p] = outString;
    });

    DEBUG.msg(tTable);
    return tTable;
  }

  // Set the state of the board's nodes to the permutation argument
  setNodesToPerm(permutation) {
    const inps = this.connectedNodes.inputs;

    for (let i = 0; i < this.inpCount; i++) {
      inps[i].setPower(permutation.charAt(i) === '1' ? true : false);
    }
    this.evalAllNodePower();
  }

  // Propagate power from board's Inputs in the correct order
  computeOutputs() {
    // Store array of unique, connected gates in this.connectedGates
    const inps = this.connectedNodes.inputs;
    inps.forEach((inp) => {
      while (inp.returnNext()) {
        if (inp.parent.constructor.name === 'Gate') {
          if (this.connectedGates.indexOf(inp.parent) == -1) {
            this.connectedGates.push(inp.parent);
          }
        }
        inp = inp.returnNext();
      }
    });

    // For each gate in the array, calculate which layer it
    // occupies so we can evaluate them in the correct order
    this.connectedGates.forEach((g) => {
      g.setLayer();
    });

    // Sort gates by layer, low -> high, then evaluate each gate in correct order
    this.connectedGates.sort((a, b) => a.layer - b.layer);
    DEBUG.msg('%c========== Gates Sorted by Layer ==========', 'color: #0f3');
    DEBUG.msg(this.connectedGates);
    DEBUG.msg('%c===========================================', 'color: #0f3');
    this.connectedGates.forEach((gate) => {
      gate.evaluateLogic();
      this.evalAllNodePower();
    });
  }

  evalAllNodePower() {
    this.board.allNodes.forEach((n) => n.evalPower());
  }

  /**
   *  Cool as fuck decimal to binary trick to generate permutations for our inputs
   *
   * By counting up in decimal and converting the digits to binary
   * we generate the needed permutations for which inputs are switched on
   * Example:
   * 4 inputs: 0000
   * Possible ON/OFF arrangements is the same as counting up in binary
   * 0000
   * 0001
   * 0010
   * 0011
   * etc...*
   *
   */
  generatePermutations() {
    const permsCount = 2 ** this.inpCount;
    const permsStrings = [];

    for (let i = 0; i < permsCount; i++) {
      // Convert decimal to binary string  5 => 101
      let val = i.toString(2);
      // Add leading zeroes to match the amount of inputs
      val = val.padStart(this.inpCount, '0');
      // Add to array
      permsStrings.push(val);
    }

    return permsStrings;
  }

  // Which of the board's inputs are connected to an output?
  // We want to ignore ones that aren't connected.
  findConnections() {
    // Array of indexes that have a connection to an output
    const fullConnections = {
      inputs: [],
      outputs: [],
    };
    // For each input, traverse through the next item in the chain
    this.board.inputs.forEach((startNode) => {
      let node = startNode.returnNext();
      if (node) {
        while (node.returnNext()) {
          node = node.returnNext();
        }

        // Examine last node in connection
        if (node.type === 'OUTPUT') {
          // Add connected inputs to return object
          if (fullConnections.inputs.indexOf(startNode) === -1) {
            fullConnections.inputs.push(startNode);
          }

          // Add connected outputs to return object
          const output = this.board.outputs[node.index];
          if (fullConnections.outputs.indexOf(output) === -1) {
            fullConnections.outputs.push(output);
          }
        }
      }
    });

    // DEBUG.msg(fullConnections);
    return fullConnections;
  }

  /**
   *
   *  Abusing the fact that sets can only contain unique values. 😎
   *
   * Generate a random permutation
   * set.add(randomPerm)
   * repeat enough times that we totally 100% for sure 😉 have all permutations
   *
   */
  generatePermutationsWACKY(w) {
    const set = new Set();
    const width = w ?? 1;

    // Just a big loop
    for (let i = 0; i < width * 10; i++) {
      let str = '';

      // Generate random permutation
      for (let i = 0; i < width; i++) {
        let digit = Math.random() > 0.5 ? '1' : '0';
        str += digit;
      }

      // Try to add to set
      set.add(str);
    }

    DEBUG.msg(set);
  }
}
