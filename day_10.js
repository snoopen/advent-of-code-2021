let sample = `[({(<(())[]>[[{[]{<()<>>
  [(()[<>])]({[<{<<[]>>(
  {([(<{}[<>[]}>{[]{[(<()>
  (((({<>}<{<{<>}{[]{[]{}
  [[<[([]))<([[{}[[()]]]
  [{[{({}]{}}([{[{{{}}([]
  {<[[]]>}<{[{[{[]{()[[[]
  [<(<(<(<{}))><([]([]()
  <{([([[(<>()){}]>(<<{{
  <{([{{}}[<[[[<>{}]]]>[]]
`;


let points = {
  '': 0,
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};

let points2 = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

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
  .map(e=>e.trim())
;

let opener = '([{<';
let closer = ')]}>';

let match = {
  '(': ')',
  '{': '}',
  '[': ']',
  '<': '>',
  ')': '(',
  '}': '{',
  ']': '[',
  '>': '<',
}

function reduceThing2(input) {
  let opens = [];
  let result = '';
  let index = 0;
  for (let c of input) {
    if (opener.includes(c)) {
      opens.push(c);
    } else {
      let x = opens.slice(-1)[0];
      let w = match[c];
      let m = w !== x;
      index
      if (m) {
        result = c;
        break;
      } else {
        opens.pop();
      }
    }
    index++;
  }
  return result;
}

function part1() {
  let result = 0;
  for (var line of data) {
    let m = reduceThing2(line);
    let s = points[m];
    result += s;
  }
  return result;
}

function fixthing(input) {
  let opens = [];
  let result = '';
  let index = 0;
  for (let c of input) {
    if (opener.includes(c)) {
      opens.push(c);
    } else {
      let x = opens.slice(-1)[0];
      let w = match[c];
      let m = w !== x;
      index
      if (m) {
        result = c;
        break;
      } else {
        opens.pop();
      }
    }
    index++;
  }
  let score = 0;
  while (opens.length>0) {
    score = score*5;
    let o = opens.pop();
    let m = match[o];
    let p = points2[m];
    score += p;
    input = input + m;
  }
  return score;
}

function part2() {
  let result = 0;
  let scores = [];
  let d2 = data.filter(e=>reduceThing2(e)==='');
  for (var line of d2) {
    let m = fixthing(line);
    scores.push(m);
  }
  scores.sort((a,b)=>a-b);
  let mid = (scores.length-1)/2;
  return scores[mid];
}

console.log(`part 1: ${part1()}`);
console.log(`part 2: ${part2()}`);
