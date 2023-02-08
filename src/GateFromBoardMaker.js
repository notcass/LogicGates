class GateFromBoardMaker {
  constructor(parent) {
    this.board = parent;
    this.connectedNodes = this.findConnections();
    this.inpCount = this.connectedNodes.inputs.length;
    this.outCount = this.connectedNodes.outputs.length;
    this.gateSet = new Set();
    this.TEST_COUNTER = 0;
    this.TEST_COUNTER_HOLDER = {};
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

      // DEBUGGER HELP
      let inputs = this.connectedNodes.inputs;
      let outputs = this.connectedNodes.outputs;

      this.connectedNodes.outputs.forEach((o) => {
        // Add outupts to the end of the perm string and insert into truth table
        outString += o.power == true ? '1' : '0';
      });
      tTable[p] = outString;
    });

    // console.log(tTable);
    return tTable;
  }

  // Set the state of the board's nodes to the permutation argument
  setNodesToPerm(permutation) {
    const inps = this.connectedNodes.inputs;

    for (let i = 0; i < this.inpCount; i++) {
      inps[i].power = permutation.charAt(i) === '1' ? true : false;
    }
    this.evalNodePower();
  }

  // FIXME:
  // It seems when we chain 2 gates together and try to make a new gate from the board,
  // we run into problems with getting the wrong output in the truth table
  // Im guessing the problem is somewhere in the way we compute or evaluate power states
  //
  // Found BUG: When we loop through all the gates here, we loop through in the order they were created, but
  // we need to access them in LEFT to RIGHT on the screen, since that is the direction our power flows.
  //

  // Propagate power from board's Inputs
  newComputeOutputs() {
    // Create a set of gates that are fully connected
    inps = this.connectedNodes.inputs;
    inps.forEach((inp) => {
      while (inp.returnNext()) {
        if (inp.parent.constructor.name == 'Gate') {
          // console.log(inp.parent);
          this.gateSet.add(inp.parent);
        }
        // console.log(inp);
        inp = inp.returnNext();
      }
    });

    // For each gate in the set, figure out which layer it occupies.
    console.log(this.gateSet);
    let exampleGate = [...this.gateSet][2];
    this.traverseNodesFromGate(exampleGate);
  }

  traverseNodesFromGate(gate) {
    console.log('%c======================', 'color: #d44');
    console.log(`%cSTARTING GATE: ${gate.label} ${gate.id}`, `color: #3f0`);
    this.TEST_COUNTER_HOLDER[gate] = [];
    console.log(gate);

    gate.gateInputs.forEach((inpNode) => {
      console.log(`%cNODE: ${inpNode.id}`, `color: #a3e`);

      this.goDownNodeChain(inpNode, gate);
      console.log('%c======================', 'color: deepskyblue');
    });
  }

  goDownNodeChain(node, startGate) {
    console.log(`Head is at node ${node.id}`);

    const prev = node.prev;
    const prevType = prev.constructor.name;

    if (prevType === 'InputNode') {
      console.log('PrevType is InputNode');
      // STORE THE COUNTER GLOBALLY HERE
      console.log(`Storing counter ${this.TEST_COUNTER}`);

      this.TEST_COUNTER_HOLDER[startGate].push(this.TEST_COUNTER);
      console.log(`Pushing ${this.TEST_COUNTER}`);

      this.TEST_COUNTER = 0;
    } else {
      console.log(`Going to move head to ${prev.id}`);
      if (prev.type === 'GATE_OUTPUT') {
        // INCREASE THE COUNTER HERE
        this.TEST_COUNTER++;
        prev.parent.gateInputs.forEach((inp) => {
          this.goDownNodeChain(inp, startGate);
        });
      }

      if (prev.type === 'GATE_INPUT') {
        this.goDownNodeChain(prev.prev, startGate);
      }
    }
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

    // console.log(fullConnections);
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

    console.log(set);
  }
}
