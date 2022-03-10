let sample;

sample = `[1,2]
[[1,2],3]
[9,[8,7]]
[[1,9],[8,5]]
[[[[1,2],[3,4]],[[5,6],[7,8]]],9]
[[[9,[3,8]],[[0,9],6]],[[[3,7],[4,9]],3]]
[[[[1,3],[5,3]],[[1,3],[8,7]]],[[[4,9],[6,9]],[[8,2],[7,3]]]]
`;

// sample = `[[[[[9,8],1],2],3],4]`;
// sample = `[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]`;
// sample = `[[9,[8,[7,[6,5]]]],[4,[3,[2,[1,0]]]]]`;
sample = `[[9,1],[1,9]]`;

let sampleBase = `[[[[4,3],4],4],[7,[[8,4],9]]]`;
let sampleAdd = `[1,1]`;

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
  .filter(e=>e.trim()!=='')
;

function Snail() {
  return {
    type: 'snail',
    left: null,
    right: null,
    parent: null,
    isEnd: function() {
      return (this.left.type === 'numb' && this.right.type === 'numb');
    }
  };
}

function Numb(value, parent) {
  return {
    type: 'numb',
    value,
    parent,
    isEnd: function() { return false },
  };
}

function parseItem(item, parent) {
  if (Array.isArray(item)) {
    let snail = new Snail();
    snail.left = parseItem(item[0], snail);
    snail.right = parseItem(item[1], snail);
    snail.parent = parent;
    return snail;
  } else {
    return new Numb(item, parent);
  }
}

function print(item) {
  console.log(JSON.stringify(convertItem(item)));
}

function convertItem(item) {
  if (item.type === 'numb') return item.value;
  return [convertItem(item.left), convertItem(item.right)];
}

function childRefence(item, side) {
  if (item[side].type === 'snail') {
    return childRefence(item[side], side);
  }
  if (item[side].type === 'numb') {
    return item[side];
  }
}

function nextReference(item, side) {
  if (item.parent === null) return null;
  let parent = item.parent;
  let other = side === 'left' ? 'right' : 'left';
  if (parent[side].type === 'numb') {
    return parent[side];
  }
  if (parent[side] === item) {
      return nextReference(parent, side);
  }
  if (parent[side].type === 'snail') {
    return childRefence(parent[side], other);
  }
  throw new Error('oh right');
}

function explode(item, depth) {
  depth = depth || 1;
  let result = false;
  let sides = ['left','right'];
  if (item.left.type === 'snail') {
    let r = explode(item.left, depth + 1);
    if (r) return true;
  }
  if (item.right.type === 'snail') {
    let r =  explode(item.right, depth + 1);
    if (r) return true;
  }
  for (let side of sides) {
    if (item[side].isEnd() && depth > 3) {
      let left = nextReference(item[side], 'left');
      let right = nextReference(item[side], 'right');
      if (left !== null) left.value += item[side].left.value;
      if (right !== null) right.value += item[side].right.value;
      item[side] = new Numb(0, item);
      result = true;
      return true;
    }
  }
  return result;
}

function split(item) {
  let sides = ['left','right'];
  let result = false;
  for (let side of sides) {
    let next = item[side];
    if (next.type === 'numb') {
      if (next.value > 9) {
        let left = Math.floor(next.value / 2);
        let right = next.value - left;
        let snail = new Snail();
        snail.left = new Numb(left, snail);
        snail.right = new Numb(right, snail);
        snail.parent = item;
        item[side] = snail;
        result = true;
        return true;
      }
    } else {
      let r = split(next);
      if (r) return true;
      result = result || r;
    }
  }
  return result;
}

function addSnail(base, add) {
  
  let newRoot = parseItem([null,null], null);
  
  newRoot.left = base;
  base.parent = newRoot;
  
  newRoot.right = add;
  add.parent = newRoot;

  return newRoot;
}

function processSnail(item) {
  let exploding = true;
  let splitting = false;
  while (exploding || splitting) {
    while (exploding) {
      exploding = explode(item);
      // print(item);
    }
    splitting = split(item);
    // print(item);
    if (splitting === true) exploding = true;
  }
}

function checkParent(item, parent) {
  if (item.parent !== parent) {
    console.log('start error');
    print(item);
    console.log('end error');
  }
  if (item.type === 'snail') {
    checkParent(item.left, item);
    checkParent(item.right, item);
  }
}

function magnitude(item) {
  let left = 0;
  let right = 0;
  if (item.left.type === 'numb') {
    left = item.left.value;
  } else {
    left = magnitude(item.left);
  }
  if (item.right.type === 'numb') {
    right = item.right.value;
  } else {
    right = magnitude(item.right);
  }
  return left * 3 + right * 2;
}

function part1() {
  let root;
  let result = 0;
  for (var line of data) {
    let parsed = JSON.parse(line);
    let next = parseItem(parsed, null);
    if (root) {
      root = addSnail(root, next);
    } else {
      root = next;
    }
    processSnail(root);
  }
  
  return magnitude(root);
}

function part2() {
  let result = 0;
  let maxPair = {};
  for (var li in data) {
    for (var ri in data) {
      if (li!==ri) {
        let left = parseItem(JSON.parse(data[li]), null);
        let right = parseItem(JSON.parse(data[ri]), null);
        let root = addSnail(left, right);
        processSnail(root);
        let mag = magnitude(root);
        if (mag > result) {
          result = mag;
          maxPair = {
            left,
            right,
          };
        }
      }
    }
  }
  return result;
}

answer1 = part1();
answer2 = part2();

console.log(`part 1: ${answer1}`);
console.log(`part 2: ${answer2}`);