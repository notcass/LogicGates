class Debug {
  constructor() {
    this.test = 'hi';
  }

  // Bound to 'c' on keyboard
  // Copy and paste the console.logs into DEBUG_SETUPS to quickly make a new
  // board state for debugging
  CREATE_SETUP_FROM_BOARD_STATE() {
    const validGates = board.gates.filter(
      (g) => g.areInputsFull() && g.areOutputsFull()
    );
    console.log(validGates);
    console.log(board.inputs);

    // Reset ID's on board nodes
    let count = 0;
    const boardNodes = [...board.inputs, ...board.outputs];
    boardNodes.forEach((n) => {
      n.id = count;
      count++;
    });

    // Reset ID's for gate nodes
    validGates.forEach((g) => {
      g.gateInputs.forEach((i) => {
        i.id = count;
        count++;
      });

      g.gateOutputs.forEach((o) => {
        o.id = count;
        count++;
      });
    });

    console.log(
      `board = new Board(width, height, ${board.inpCount}, ${board.outCount})`
    );

    console.log(`const a = board.allNodes`);
    validGates.forEach((g) => {
      // Create object
      console.log(`board.makeNewGate(${g.label.toLowerCase()}Gate, board)`);
    });

    validGates.forEach((g, index) => {
      // Set object position
      console.log(`board.gates[${index}].x = ${floor(g.x)}`);
      console.log(`board.gates[${index}].y = ${floor(g.y)}`);
    });

    validGates.forEach((g) => {
      // Set next/previous nodes
      g.gateInputs.forEach((inp) => {
        let x = inp.id;
        let y = inp.prev.id;
        console.log(`a[${y}].next = a[${x}]`);
        console.log(`a[${x}].prev = a[${y}]`);
      });

      g.gateOutputs.forEach((out) => {
        let x = out.id;
        let y = out.next.id;
        console.log(`a[${x}].next = a[${y}]`);
        console.log(`a[${y}].prev = a[${x}]`);
      });
    });
  }

  LOAD_SETUP(n) {
    if (n === 1) {
      board = new Board(width, height, 2, 2);
      const a = board.allNodes;
      board.makeNewGate(notGate, board, 0);
      board.makeNewGate(notGate, board, 1);
      board.gates[1].y = 350;

      // Two AND gates
      a[0].next = a[4];
      a[4].prev = a[0];

      a[5].next = a[2];
      a[2].prev = a[5];

      a[1].next = a[6];
      a[6].prev = a[1];

      a[7].next = a[3];
      a[3].prev = a[7];
    }
    if (n === 2) {
      board = new Board(width, height, 3, 2);
      const a = board.allNodes;
      board.makeNewGate(notGate, board, 0);
      board.makeNewGate(andGate, board, 1);
      board.gates[1].x = 200;
      board.gates[1].y = 350;

      // 3 inputs
      // One NOT and one AND gate
      a[0].next = a[5];
      a[5].prev = a[0];

      a[6].next = a[3];
      a[3].prev = a[6];

      a[1].next = a[7];
      a[7].prev = a[1];

      a[9].next = a[4];
      a[4].prev = a[9];

      a[2].next = a[8];
      a[8].prev = a[2];
    }
    if (n === 3) {
      board = new Board(width, height, 3, 2);
      const a = board.allNodes;

      board.makeNewGate(notGate, board, 0);
      board.makeNewGate(andGate, board, 1);
      board.gates[1].x = 200;
      board.gates[1].y = 350;
      board.gates[0].x = 600;
      board.gates[0].y = 350;

      // 3 inputs
      // One NOT and one AND gate

      a[1].next = a[7];
      a[7].prev = a[1];

      a[9].next = a[5];
      a[5].prev = a[9];

      a[2].next = a[8];
      a[8].prev = a[2];

      a[6].next = a[4];
      a[4].prev = a[6];
    }
    if (n === 4) {
      board = new Board(width, height, 3, 2);
      const a = board.allNodes;

      board.makeNewGate(notGate, board, 0);
      board.gates[0].x = 564;
      board.gates[0].y = 205;
      board.makeNewGate(andGate, board, 1);
      board.gates[1].x = 200;
      board.gates[1].y = 350;
      a[0].next = a[5];
      a[5].prev = a[0];
      a[6].next = a[3];
      a[3].prev = a[6];
      a[1].next = a[7];
      a[7].prev = a[1];
      a[2].next = a[8];
      a[8].prev = a[2];
      a[9].next = a[4];
      a[4].prev = a[9];
    }
    if (n === 5) {
      board = new Board(width, height, 3, 2);
      const a = board.allNodes;
      board.makeNewGate(notGate, board);
      board.makeNewGate(andGate, board);
      board.makeNewGate(notGate, board);
      board.makeNewGate(notGate, board);
      board.makeNewGate(notGate, board);
      board.gates[0].x = 352;
      board.gates[0].y = 401;
      board.gates[1].x = 176;
      board.gates[1].y = 345;
      board.gates[2].x = 364;
      board.gates[2].y = 183;
      board.gates[3].x = 162;
      board.gates[3].y = 121;
      board.gates[4].x = 565;
      board.gates[4].y = 125;
      a[9].next = a[5];
      a[5].prev = a[9];
      a[6].next = a[4];
      a[4].prev = a[6];
      a[1].next = a[7];
      a[7].prev = a[1];
      a[2].next = a[8];
      a[8].prev = a[2];
      a[9].next = a[5];
      a[5].prev = a[9];
      a[13].next = a[10];
      a[10].prev = a[13];
      a[11].next = a[14];
      a[14].prev = a[11];
      a[0].next = a[12];
      a[12].prev = a[0];
      a[13].next = a[10];
      a[10].prev = a[13];
      a[11].next = a[14];
      a[14].prev = a[11];
      a[15].next = a[3];
      a[3].prev = a[15];
    }
    if (n === 6) {
      board = new Board(width, height, 3, 2);
      const a = board.allNodes;

      board.makeNewGate(notGate, board);
      board.makeNewGate(andGate, board);
      board.makeNewGate(notGate, board);
      board.makeNewGate(notGate, board);
      board.makeNewGate(andGate, board);
      board.gates[0].x = 352;
      board.gates[0].y = 401;
      board.gates[1].x = 176;
      board.gates[1].y = 345;
      board.gates[2].x = 364;
      board.gates[2].y = 183;
      board.gates[3].x = 162;
      board.gates[3].y = 121;
      board.gates[4].x = 573;
      board.gates[4].y = 216;
      a[9].next = a[5];
      a[5].prev = a[9];
      a[6].next = a[15];
      a[15].prev = a[6];
      a[1].next = a[7];
      a[7].prev = a[1];
      a[2].next = a[8];
      a[8].prev = a[2];
      a[9].next = a[5];
      a[5].prev = a[9];
      a[13].next = a[10];
      a[10].prev = a[13];
      a[11].next = a[14];
      a[14].prev = a[11];
      a[0].next = a[12];
      a[12].prev = a[0];
      a[13].next = a[10];
      a[10].prev = a[13];
      a[11].next = a[14];
      a[14].prev = a[11];
      a[6].next = a[15];
      a[15].prev = a[6];
      a[16].next = a[3];
      a[3].prev = a[16];
    }
    if (n === 7) {
      board = new Board(width, height, 3, 2);
      const a = board.allNodes;
      board.makeNewGate(andGate, board);
      board.makeNewGate(notGate, board);
      board.makeNewGate(notGate, board);
      board.makeNewGate(andGate, board);
      board.gates[0].x = 176;
      board.gates[0].y = 345;
      board.gates[1].x = 364;
      board.gates[1].y = 183;
      board.gates[2].x = 162;
      board.gates[2].y = 121;
      board.gates[3].x = 573;
      board.gates[3].y = 216;
      a[1].next = a[5];
      a[5].prev = a[1];
      a[2].next = a[6];
      a[6].prev = a[2];
      a[7].next = a[13];
      a[13].prev = a[7];
      a[11].next = a[8];
      a[8].prev = a[11];
      a[9].next = a[12];
      a[12].prev = a[9];
      a[0].next = a[10];
      a[10].prev = a[0];
      a[11].next = a[8];
      a[8].prev = a[11];
      a[9].next = a[12];
      a[12].prev = a[9];
      a[7].next = a[13];
      a[13].prev = a[7];
      a[14].next = a[3];
      a[3].prev = a[14];
    }
  }

  SHOW_NODE_INFO() {
    board.allNodes.forEach((n) => {
      noStroke();
      fill(COLORS.WHITE);
      textSize(12);
      text(`${n.type}`, n.x - 20, n.y - 50);
      text(`${n.id}`, n.x - 20, n.y - 65);
    });
  }
}