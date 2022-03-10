let sample = `199
200
208
210
200
207
240
269
260
263`;

let all_timer = process.hrtime();

var elapsed_time = function (hrtime) {
  var us_elapsed = process.hrtime(hrtime)[0] * 1000000 + process.hrtime(hrtime)[1] / 1000;
  return us_elapsed;
}

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
  .map(e => Number(e))
;

let _answer1 = 0;
let _answer2 = 0;

function part1() {
  let last = data[0];
  for (var line of data) {
    if (line > last) _answer1 += 1;
    last = line;
  }
}

function part2() {
  let count = 0;
  let last;
  for (let index = 2; index < data.length; index++) {
    let window_sum = data.slice(index - 2, index + 1).reduce((p, c) => p + c, 0);
    if (typeof last !== 'undefined') {
      if (window_sum > last) count++;
    }
    last = window_sum;
  }
  _answer2 = count;
}

part1();
part2();

let answer1 = _answer1;
let answer2 = _answer2;

console.log(`part 1: ${answer1}`);
console.log(`part 2: ${answer2}`);
console.log(`overall time: ${elapsed_time(all_timer).toFixed(1)}us`);
