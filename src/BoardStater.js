class BoardStater {
  constructor(parent) {
    this.board = parent;
    this.connectedNodes = this.findConnections();
    this.inpCount = this.connectedNodes.inputs.length;
  }

  start(parent) {
    this.board = parent;
    this.connectedNodes = this.findConnections();
    this.inpCount = this.connectedNodes.inputs.length;

    const truthTable = [];
    const perms = generatePermutations();

    // For each input permutation
    perms.forEach((p) => {
      // Set the board nodes to the permutation
      setNodesToPerm(p);

      // Propagate power to outputs
      computeOutputs();

      // Then examine the outputs
      let outString = '';
      this.board.outputs.forEach((o) => {
        // Add outupts to the end of the perm string and insert into truth table
        outString += o.power ? '1' : '0';
      });
      truthTable.push([p + outString]);
    });

    return truthTable;
  }
  setNodesToPerm(permutation) {
    const inps = this.board.inputs;

    for (let i = 0; i < this.inpCount; i++) {
      inps[i].power = permutation.charAt(i) === '1' ? true : false;
    }
    evalNodePower();
  }

  computeOutputs() {
    this.board.gates.forEach((g) => {
      g.checkLogic();
    });
    evalNodePower();
  }

  evalNodePower() {
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

    return fullConnections;
  }
}
