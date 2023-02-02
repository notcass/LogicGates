class BoardStater {
  constructor(parent, connectedNodes) {
    this.board = parent;
    this.inputs = parent.inputs;
    this.powerButtons = parent.powerButtons;
    this.outputs = parent.outputs;
    this.gates = parent.gates;
    this.allNodes = parent.allNodes;
    this.connectedNodes = connectedNodes;
  }

  start() {
    const inpCount = this.connectedNodes.inputs.length;
    const outCount = this.connectedNodes.outputs.length;
    const outputStartIndex = inpCount;

    // console.log(`inpCount ${inpCount}`);
    // console.log(`outCount ${outCount}`);
    // console.log('Connected Nodes:');
    // console.log(this.connectedNodes);
    this.getOutputState(0);

    let truthTable = {};

    // For each INPUT
    for (let input = 0; input < inpCount; input++) {
      // For each POWER STATE of the input (always 1 or 0)
      for (let inputState = 0; inputState < 2; inputState++) {
        // Examine the OUTPUT, with the INPUT's POWERSTATE
        this.examine(input, inputState);
        // STORE THE RESULT??
      }
    }
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
