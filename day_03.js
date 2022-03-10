// hey future me, don't panic! This solution is not implemented here because you wrote
// the solutions for parts 1 thru 4  in Rust instead! Congrats on learning a little bit of Rust.

let sample = `xxxxx`;

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

function part1() {
  let result = 0;
  for (var line of data) {

  }
  return result;
}

function part2() {
  let result = 0;
  for (var line of data) {

  }
  return result;
}

console.log(`part 1: ${part1()}`);
console.log(`part 2: ${part2()}`);
