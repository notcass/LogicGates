class Debug {
  constructor() {
    this.test = 'hi';
  }

  // Bound to 'c' on keyboard
  // Copy and paste the console.logs into DEBUG_SETUPS to quickly make a new
  // board state for debugging
  CREATE_SETUP_FROM_BOARD_STATE() {
    console.log(
      `board = new Board(width, height, ${board.inpCount}, ${board.outCount})`
    );

    console.log(`const a = board.allNodes`);
    board.gates.forEach((g) => {
      // Create object
      console.log(
        `board.makeNewGate(${g.label.toLowerCase()}Gate, board, ${g.id})`
      );

      // Set object position
      console.log(`board.gates[${g.id}].x = ${floor(g.x)}`);
      console.log(`board.gates[${g.id}].y = ${floor(g.y)}`);
    });

    board.gates.forEach((g) => {
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
      console.log(a);

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
      console.log(a);

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
