let sample = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581
`;

const fs = require('fs');
let input;
if (process.argv[2] === "sample") {
  input = sample;
} else {
  let day = process.argv[2] || process.argv[1].slice(-2);
  let filename = `input/day_${day}.txt`;
  input = fs
    .readFileSync(filename)
    .toString();
}

let data = input
  .split(/\r?\n/)
  .filter(e => e.trim() !== '')
  .map(e => e.split('').map(e => e * 1))
;

let near = [
  [0, -1],
  [-1, 0],
  [1, 0],
  [0, 1],
];

function updateNeighbours(node, scores, data, xMax, yMax, queue, best) {
  let newScore = scores[node.y][node.x] + data[node.y][node.x];
  for (let n of near) {
    let x = node.x + n[0];
    let y = node.y + n[1];
    if (
      (x >= 0 && x < xMax) &&
      (y >= 0 && y < yMax)
    ) {
      let oldScore = scores[y][x];
      if (newScore < oldScore) {
        scores[y][x] = newScore;
        if (queue) queue.addNode(newScore, x, y);
        if (best) best[y][x] = { x: node.x, y: node.y };
      }
    }
  }
}

// move diagonal up
function nextNode(node, xMax, yMax) {
  let x = node.x;
  let y = node.y;
  let s = x + y;
  x++;
  y--;
  if (y < 0) {
    y = x;
    x = 0;
  }
  if (y >= yMax) {
    y--;
    x++;
  }
  if (x >= xMax) {
    x = xMax - (yMax-y-2);
    y = yMax - 1;
  }
  return { x, y };
}

function sameNode(node1, node2) {
  if (node1.x !== node2.x) return false;
  if (node1.y !== node2.y) return false;
  return true;
}

function part1() {
  let startNode = {
    x: 0,
    y: 0,
  }
  
  let endNode = {
    x: data[0].length-1,
    y: data.length-1,
  };
  
  let xMax = data[0].length;
  let yMax = data.length;
  // I think I need the hack only because I'm not using a priority queue
  // what I should be doing is adding neighbouring nodes and their scores
  // then picking the next smallest from that queue
  let hack = 3;
  let scores = Array.from({length: yMax}, () => Array.from({length: xMax}, () => 9999));
  let best = Array.from({length: yMax}, () => Array.from({length: xMax}, () => []));
  scores[startNode.y][startNode.x] = 0;
  
  let current = startNode;
  
  while (!sameNode(current, endNode)) {
    // console.log(current);
    let x = current.x;
    let y = current.y;
    // let key = x + ':' + y;
    // visited.push(key);
    // updateNeighbours(current, scores, xMax, yMax);
    updateNeighbours(current, scores, data, xMax, yMax);
    current = nextNode(current, xMax, yMax);
    if (sameNode(current, endNode) && hack > 0) {
      current = startNode;
      hack--;
    }
  }
  // console.table(scores);
  return scores[endNode.y][endNode.x];
}

function Item(score, x, y) {
  score = typeof score !== 'undefined' ? score : 999;
  next = typeof next !== 'undefined' ? next : null;
  x = typeof x !== 'undefined' ? x : -1;
  y = typeof y !== 'undefined' ? y : -1;
  return {
    next,
    score,
    x,
    y,
  }
}

function List() {
  let head = null;
  let tail = null;
  return {
    addNode: function(score, x, y) {
      let item = new Item(score, x, y);
      return this.addItem(item);
    },
    addItem: function(node) {
      if (head === null) {
        head = node;
        tail = node;
        return head;
      } else {
        return this.insertNode(node);
      }
    },
    insertNode: function(node) {
      let current = head;
      while (current.score < node.score) {
        if(current.next === null) break;
        current = current.next;
      }
      node.next = current.next;
      current.next = node;
      tail = node;
      return current;
    },
    pop: function() {
      let temp = head;
      head = head.next;
      return temp;
    },
    jamNode(score, x, y) {
      let item = new Item(score, x, y);
      tail.next = item;
    },
    getHead: function() {
      return head;
    }
  }
}

function part2() {
  
  let xMax0 = data[0].length;
  let yMax0 = data.length;

  let resize = 5;

  let data2 = Array.from({length: yMax0*resize}, () => Array.from({length: xMax0*resize}, () => 0));

  let xMax = data2[0].length;
  let yMax = data2.length;

  let startNode = {
    x: 0,
    y: 0,
  }
  
  let endNode = {
    x: data2[0].length-1,
    y: data2.length-1,
  };
  
  // adjust for 5x expansion
  for (let y in data) {
    y = y * 1;
    for (let x in data[y]) {
      x = x * 1;
      for (let y2 = 0; y2 < resize; y2++) {
        for (let x2 = 0; x2 < resize; x2++) {
          let i = data[y][x] + x2 + y2;
          if (i > 9) i = i - 9;
          data2[y+((yMax0)*y2)][x+((xMax0)*x2)] = i;
        }
      }
    }
  }

  let queue = new List();
  let n = startNode;
  while (!sameNode(n, endNode)) {
    queue.addNode(9999, n.x, n.y);
    n = nextNode(n, xMax, yMax);
  }
  
  let scores = Array.from({length: yMax}, () => Array.from({length: xMax}, () => 9999));
  let best = Array.from({length: yMax}, () => Array.from({length: xMax}, () => 0));
  let map = Array.from({length: yMax}, () => Array.from({length: xMax}, () => '.'));
  scores[startNode.y][startNode.x] = 0;
  
  let current = queue.pop();
  let iter = 0;

  while (true) {
    iter ++;
    updateNeighbours(current, scores, data2, xMax, yMax, queue, best);
    if (sameNode(current, endNode)) break;
    current = queue.pop();

  }

  let c = endNode;
  let s = 0;
  while (true) {
    map[c.y][c.x] = data2[c.y][c.x];
    if (sameNode(c, startNode)) break;
    s += data2[c.y][c.x];
    c = best[c.y][c.x];
  }

  // console.log(map.map(e=>e.join('')).join('\n')); // pretty map
  // console.table(map); // also pretty map
  
  // console.log(scores[endNode.y][endNode.x]);
  return s;
}

console.log(`part 1: ${part1()}`);
console.log(`part 2: ${part2()}`);
