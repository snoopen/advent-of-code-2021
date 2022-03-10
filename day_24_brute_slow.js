// Well... this became a mess!
// This bruteforce method attempts to minimise z of the computed result while
// taking the max or min input and decreasing or increasing it then reports
// the result when z is zero. For the max input, I get the correct answer on the
// first round. For the minimum it's about the 24th round.

// Change starting value to 9 for part 1 or 1 for part2. This then creates a
// 14 digit long array of the starting value.
const startingValue = 9;

let sample = `inp w
add z w
mod z 2
div w 2
add y w
mod y 2
div w 2
add x w
mod x 2
div w 2
mod w 2
`;

const fs = require('fs');
let input;
if (process.argv[2] === "sample") {
  input = sample;
} else {
  let day = process.argv[2] ? process.argv[2] : '24';
  let filename = `input/day_${day}.txt`;
  input = fs
    .readFileSync(filename)
    .toString();
}

let data = input
  .split(/\r?\n/)
  .filter(e => e.trim() !== '')
;

const STATE = {
  HALTED: 'HALTED',
  RUNNING: 'RUNNING',
  INPUT: 'INPUT',
  END: 'END',
};

const ALU = () => {

  let data;
  let state = STATE.HALTED;
  let index = -1;
  let buffer = null;
  let inputPointer = null;
  let reg = {
    w: 0,
    x: 0,
    y: 0,
    z: 0,
  };
  const step = _step();

  function inp(a) {
    inputPointer = a;
    state = STATE.INPUT;
  }
  function add(a, b) {
    let temp = parseInt(b);
    temp = Number.isNaN(temp) ? reg[b] : b * 1;
    reg[a] += temp;
  };
  function mul(a, b) {
    let temp = parseInt(b);
    temp = Number.isNaN(temp) ? reg[b] : b * 1;
    reg[a] *= temp;
  }
  function div(a, b) {
    let temp = parseInt(b);
    temp = Number.isNaN(temp) ? reg[b] : b * 1;
    if (reg[a] > 0) reg[a] = Math.floor(reg[a] / temp);
    if (reg[a] < 0) reg[a] = Math.ceil(reg[a] / temp);
  }
  function mod(a, b) {
    let temp = parseInt(b);
    temp = Number.isNaN(temp) ? reg[b] : b * 1;
    reg[a] = reg[a] % temp;
  }
  function eql(a, b) {
    let temp = parseInt(b);
    temp = Number.isNaN(temp) ? reg[b] : b * 1;
    reg[a] = reg[a] === temp ? 1 : 0;
  }

  const instructions = {
    inp,
    add,
    mul,
    div,
    mod,
    eql,
  }

  function init(_data) {
    data = _data;
    state = STATE.RUNNING;
    return this;
  }

  function* _step(input) {
    // l(data.length);

    while (state !== STATE.END && index < data.length - 1) {
      if (state === STATE.INPUT && typeof input !== 'undefined') {
        throw new Error('oh right...')
      } else {
        index++;
        let temp = data[index].split(' ');
        let inst = instructions[temp[0]];
        let op = temp.slice(1);
        if (typeof inst === 'undefined') { throw new Error('INST not found') }
        // while (true) {
        let result = inst(...op);
        // l(reg);
        // l(data[index]);
        yield (result);
      }
    }
    return '';
  }

  function getInput(input) {
    if (inputPointer !== null) {
      reg[inputPointer] = input;
      inputPointer = null;
      state = STATE.RUNNING;
    } else {
      throw new Error('null inputPointer');
    }
  }

  return {
    init,
    step,
    getInput,
    get state() {
      return state;
    },
    reg,
  };
};


function slowComputer(inputs) {
  inputs = Array.from(inputs);
  let alu = ALU().init(data);
  let step = alu.step.next();

  while (step.done !== true) {
    if (alu.state === STATE.INPUT) {
      if (inputs.length <= 0) throw new Error('No more inputs');
      // console.table({inputs})
      // l(alu.reg);
      // l('')
      alu.getInput(inputs.shift());
    }
    step = alu.step.next();
  }
  return alu.reg;
}

function Node(score, index, inputs) {
  score = typeof score !== 'undefined' ? score : null;
  index = typeof index !== 'undefined' ? index : null;
  inputs = typeof inputs !== 'undefined' ? inputs : null;
  let next = null;
  return {
    score,
    index,
    inputs,
    next,
    get score2() {
      return score * (14-index);
    }
  };
}

function OrderedList() {
  let head = null;
  let tail = null;
  let length = 0;
  let explored = [];
  return {
    insertNew: function (score, index, inputs) {
      let inp = inputs.join('')+':'+index;
      if (explored.includes(inp)) return head;
      explored.push(inp);
      // if (explored.includes(inputs)) return head;
      // explored.push(inputs);
      let node = new Node(score, index, inputs);
      return this.insertNode(node);
    },
    insertNode: function (node) {
      length++;
      if (head === null || typeof head === 'undefined') {
        head = node;
        tail = node;
        return head;
      }

      let current = head;
      if (node.score2 <= head.score2) {
        node.next = current;
        head = node;
        current = head;
      } else {
        while (current.score2 <= node.score2) {
          if (current.next === null || typeof current.next === 'undefined') break;
          current = current.next;
        }
        node.next = current.next;
        current.next = node;
      }
      // tail = node;
      
      return current;
    },
    pop: function () {
      length--;
      if (!head) return;
      let temp = head;
      head = head.next;
      return temp;
    },
    getHead: function () {
      return head;
    },
    get length() {
      return length;
    },
    getLen: function () {
      let count = 0;
      let current = head;
      while (true) {
        if (!current) break;
        count++;
        current = current.next;
      }
      return count;
    },
    prune: function() {
      let count = 1;
      let current = head;
      let last = head;
      let prune = false;
      while (true) {
        if (!current.next) break;
        // l(current.score - last.score);
        if (!prune && count > 10 && (current.score - last.score) > 10000) {
          prune = true;
        }
        last = current;
        current = current.next;
        count++;
        if (prune) {
          last.next = null;
          delete last;
          length--;
        }
      }
    },
  }
}

function solve() {
  let inputs = Array.from({length: 14}, (v,i) => startingValue);
  let lockFirst = 0;
  let index = lockFirst;
  let queue = new OrderedList();

  let result = slowComputer(inputs);
  let score = result.z;
  let current = queue.insertNew(score, index, inputs);

  let bestest = [];
  let last  = 0;
  let pruneTime = 0;
  while (current) {
    pruneTime++;
    if (pruneTime > 1000) {
      // queue.prune();
      pruneTime = 0;
      console.log(queue.length);
    }
    current = queue.pop();
    if (!current) break;
    if (current.score === 0) {
      let best = current.inputs.join('')*1;
      if (!bestest.includes(best)) {
        bestest.push(best);
        bestest = bestest.sort((a,b)=>a-b);
      }
      if (last !== bestest.length) {
        last = bestest.length;
        let isMax = isMaxAnswer(bestest[bestest.length-1])
        let isMin = isMinAnswer(bestest[0])
        let l = bestest[0] + (isMin ? ' y' : ' n');
        let h = bestest[bestest.length-1] + (isMax ? ' y' : ' n');
        let n = bestest.length;
        console.table({l,h,n});
        // if (isMax || isMin) throw new Error('lazy quit');
      }
    }
    index = current.index;
    if (current.index > 13) index = lockFirst;
      for (let i = 1; i <= 9; i++) {
        let inputs2 = Array.from(current.inputs);
        inputs2[index] = i;
        result = slowComputer(inputs2);
        score = result.z;
        queue.insertNew(score, index + 1, inputs2);
      }
  }  
}

function isMaxAnswer(input) {
  let answer = 99999795919456;
  return input === answer;
}

function isMinAnswer(input) {
  let answer = 45311191516111;
  return input === answer;
}

console.log(`answer: ${solve()}`);
