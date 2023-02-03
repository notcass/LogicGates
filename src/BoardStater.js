class BoardStater {
  constructor(parent, connectedNodes) {
    this.board = parent;
    this.inputs = parent.inputs;
    this.powerButtons = parent.powerButtons;
    this.outputs = parent.outputs;
    this.gates = parent.gates;
    this.allNodes = parent.allNodes;
    this.connectedNodes = connectedNodes;
    this.inpCount = this.connectedNodes.inputs.length;
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

  start() {
    const inpCount = this.connectedNodes.inputs.length;
    const outCount = this.connectedNodes.outputs.length;
    const outputStartIndex = inpCount;
    let truthTable = {};
    let perms = this.generatePermutations();
    console.table(perms);
  }

  examine(input, inputState) {
    let cn = this.connectedNodes;
    // console.log(`input: ${input} `);
    // console.log(`inputState: ${inputState} `);
    return [inputState];
  }

  getOutputState(index) {
    const bool = this.connectedNodes.outputs[index].power;
    console.log(parseInt(bool));
  }
}
