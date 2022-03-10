// Well... this became a mess!
// This bruteforce method attempts to minimise z of the computed result while
// taking the max or min input and decreasing or increasing it then reports
// the result when z is zero. For the max input, I get the correct answer on the
// first round. For the minimum it's about the 24th round.

// Change starting value to 9 for part 1 or 1 for part2. This then creates a
// 14 digit long array of the starting value.
const startingValue = 1;

const logicMap = [
  [ 1,  10,  1],
  [ 1,  11,  9],
  [ 1,  14, 12],
  [ 1,  13,  6],
  [26,  -6,  9],
  [26, -14, 15],
  [ 1,  14,  7],
  [ 1,  13, 12],
  [26,  -8, 15],
  [26, -15,  3],
  [ 1,  10,  6],
  [26, -11,  2],
  [26, -13, 10],
  [26,  -4, 12],
];

function fastComputer(input) {
  let w = 0;
  let x = 0;
  let y = 0;
  let z = 0;

  for (let i = 0; i < 14; i++) {
    w = input[i];
    x = z % 26;
    z = Math.floor(z / logicMap[i][0]); //!
    x = x + logicMap[i][1]; //!
    x = x !== w ? 1 : 0;
    y = 25 * x + 1;
    z = z * y;
    y = (w + logicMap[i][2]) * x; //!
    z = z + y;
    // console.log({ w, x, y, z });
    // break;
  }
  return {w,x,y,z};
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

  let result = fastComputer(inputs);
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
        result = fastComputer(inputs2);
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
