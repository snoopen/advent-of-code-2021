let sample = `Player 1 starting position: 4
Player 2 starting position: 8
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
;

function Dice() {
  let d = 0;
  let r = 0;
  return {
    roll: function () {
      d++;
      r++;
      if (d > 100) d = 1;
      return d;
    },
    count: function () {
      return r;
    }
  }
}

function Range(min, max) {
  return Array.from({
    length: Math.abs(max - min) + 1
  }, (v, i) => min + i);
}

function part1() {
  let result = 0;
  let win = 1000;
  let limit = 10000;
  let iter = 0;
  let p1 = {
    position: data[0].slice(-1) * 1,
    score: 0,
    incPos: function (pos) {
      this.position = ((this.position + pos - 1) % 10) + 1;
      return this.position;
    },
  };
  let p2 = {
    position: data[1].slice(-1) * 1,
    score: 0,
    incPos: function (pos) {
      this.position = ((this.position + pos - 1) % 10) + 1;
      return this.position;
    },
  };
  let die = new Dice();

  while (true) {
    iter++;
    if (iter > limit) throw new Error('fail');

    let d1 = [die.roll(), die.roll(), die.roll()];
    for (let d of d1) {
      p1.incPos(d);
    }
    p1.score += p1.position;
    if (p1.score >= win) break;

    let d2 = [die.roll(), die.roll(), die.roll()];
    for (let d of d2) {
      p2.incPos(d);
    }
    p2.score += p2.position;
    if (p2.score >= win) break;
  }

  let count = die.count();
  result = Math.min(p1.score, p2.score) * count;

  return result;
}

const win2 = 21;
const rollMap = [
  [1, 1, 1],
  [1, 1, 2],
  [1, 1, 3],
  [1, 2, 1],
  [1, 2, 2],
  [1, 2, 3],
  [1, 3, 1],
  [1, 3, 2],
  [1, 3, 3],
  [2, 1, 1],
  [2, 1, 2],
  [2, 1, 3],
  [2, 2, 1],
  [2, 2, 2],
  [2, 2, 3],
  [2, 3, 1],
  [2, 3, 2],
  [2, 3, 3],
  [3, 1, 1],
  [3, 1, 2],
  [3, 1, 3],
  [3, 2, 1],
  [3, 2, 2],
  [3, 2, 3],
  [3, 3, 1],
  [3, 3, 2],
  [3, 3, 3]
];

let rollTotals = rollMap.map(e => e.reduce((p, v) => p + v, 0));

let rollMulti = {};
for (let r of rollTotals) {
  if (rollMulti[r]) {
    rollMulti[r]++;
  } else {
    rollMulti[r] = 1;
  }
}

function part2() {
  let p1p = data[0].slice(-1) * 1;
  let p2p = data[1].slice(-1) * 1;

  let wins = playRound(p1p, 0, p2p, 0, 0, 0);

  return Math.max(wins.p1, wins.p2);
}

function addPos(pos, add) {
  return ((pos + add - 1) % 10) + 1;
}

function playRound(p1p, p1s, p2p, p2s, depth, turn) {

  if (p1s >= win2) {
    return { p1: 1, p2: 0 };
  }

  if (p2s >= win2) {
    return { p1: 1, p2: 1 };
  }

  let wins = { p1: 0, p2: 0 };
  let w;

  for (let roll in rollMulti) {
    let mult = rollMulti[roll];
    roll = roll * 1;
    if (turn % 2 === 0) {
      let np1p = addPos(p1p, roll);
      let np1s = p1s + np1p;
      w = playRound(np1p, np1s, p2p, p2s, depth + 1, turn + 1);
    } else {
      let np2p = addPos(p2p, roll);
      let np2s = p2s + np2p;
      w = playRound(p1p, p1s, np2p, np2s, depth + 1, turn + 1);
    }
    wins.p1 += w.p1 * mult;
    wins.p2 += w.p2 * mult;
  }

  return wins;
}

console.log(`part 1: ${part1()}`);
console.log(`part 2: ${part2()}`);
