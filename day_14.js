let sample = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C
`;

let answer1;
let answer2;
let input;

let iter_timer;

var elapsed_time = function (hrtime, note) {
  var precision = 3; // 3 decimal places
  var us_elapsed = process.hrtime(hrtime)[0] * 1000000 + process.hrtime(hrtime)[1] / 1000;
  // console.log(process.hrtime(hrtime)[0] + " s, " + elapsed.toFixed(precision) + " ms - " + note); // print message + time
  // hrtime = process.hrtime(); // reset the timer
  return us_elapsed;
}

function loadInput() {
  const fs = require('fs');
  let filename;
  // let input;
  if (process.argv[2] !== "runner" && process.argv[2] === "sample") {
    input = sample;
  } else if (process.argv[2] !== "runner" && typeof process.argv[2] !== "undefined") {
    filename = `input/day_${process.argv[2]}.txt`;
    input = fs
      .readFileSync(filename)
      .toString();
  } else {
    throw error('oh noes');
  }
  input = input.split(/\r?\n/);
}


function part1() {
  loadInput();
  let data = input.filter(e=>e.trim()!=='');
  let limit = 10;
  let pt = data[0];
  let pi = data.slice(1).map(e=>e.split(' -> '));
  let rp = {};
  pi.forEach(e=> rp[e[0]] = e[1] );
  let pt2;
  for (let j = 0; j < limit; j++) {
    pt2 = '';
    for (let i = 0; i < pt.length; i++) {
      let s = pt.slice(i,i+2);
      let x = rp[s] || '';
      pt2 = pt2 + pt[i] + x;
    }
    pt = pt2;
  }
  let qty = {};
  for (let c of pt) {
    qty[c] = (qty[c] || 0) + 1;
  }
  let pos = Object.entries(qty).sort((a,b)=>a[1]-b[1]);
  return pos.slice(-1)[0][1] - pos[0][1];
}

function part2() {
  loadInput()
  let data = input.filter(e=>e.trim()!=='');
  let limit = 40;
  let template = data[0];
  let insertions = data.slice(1).map(e=>e.split(' -> '));
  let replacements = {};
  let totals = {};
  let [start,end] = [template[0],template.slice(-1)[0]];
  insertions.forEach(e=> replacements[e[0]] = [ (e[0][0] + e[1]), (e[1] + e[0][1]) ] );
  for (let i = 1; i < template.length; i++) {
    let pair = template.slice(i-1,i+1);
    totals[pair] = (totals[pair] || 0) +1;
  }
  for (let j = 0; j < limit; j++) {
    for (let item of Object.entries(totals)) {
      let pair = item[0];
      let count = item[1];
      let reps = replacements[pair];
      totals[pair] -= count;
      totals[reps[0]] = (totals[reps[0]] || 0) + count;
      totals[reps[1]] = (totals[reps[1]] || 0) + count;
    }
  }

  let grand = {};
  Object.entries(totals).forEach(e=>{
    grand[e[0][0]] = (grand[e[0][0]] || 0) + e[1];
    grand[e[0][1]] = (grand[e[0][1]] || 0) + e[1];
  });
  grand[start]++;
  grand[end]++;
  for (let key in grand) {
    grand[key] = grand[key] / 2;
  }
  let pos = Object.entries(grand).sort((a,b)=>a[1]-b[1]);
  return pos.slice(-1)[0][1] - pos[0][1];
}

// answer1 = part1();
// answer2 = part2();

let itterate = 500;
let timer_accum = 0;
let time = 0;
let thr = 500;

for (var i = 0; i < itterate; i++) {
  iter_timer = process.hrtime();
  answer1 = part1();
  let elapsed = elapsed_time(iter_timer);
  timer_accum += elapsed;
}
time = timer_accum / itterate;

if (time > thr) {
  console.log(`part 1 avg: ${(timer_accum / itterate / 1000 ).toFixed(2)}ms`);
} else {
  console.log(`part 1 avg: ${(timer_accum / itterate ).toFixed(0)}us`);
}


for (var i = 0; i < itterate; i++) {
  iter_timer = process.hrtime();
  answer2 = part2();
  let elapsed = elapsed_time(iter_timer);
  timer_accum += elapsed;
}

time = timer_accum / itterate;

if (time > thr) {
  console.log(`part 2 avg: ${(timer_accum / itterate / 1000 ).toFixed(2)}ms`);
} else {
  console.log(`part 2 avg: ${(timer_accum / itterate ).toFixed(0)}us`);
}

console.log(`part 1: ${answer1}`);
console.log(`part 2: ${answer2}`);