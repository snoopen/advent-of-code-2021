let sample = `forward 5
down 5
forward 8
up 3
down 8
forward 2`;

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
  // .map(e => Number(e))
  .map(e => e.split(/\s+/));

function part1() {
  let position = 0;
  let depth = 0;
  for (var line of data) {
    let command = line[0];
    let value = Number(line[1]);
    switch (command) {
      case "forward":
        position += value;
        break;

      case "up":
        depth -= value;
        break;

      case "down":
        depth += value;
        break;

      default:
        break;
    }
  }
  return position * depth;
}

function part2() {
  let position = 0;
  let depth = 0;
  let aim = 0;
  for (var line of data) {
    let command = line[0];
    let value = Number(line[1]);
    switch (command) {
      case "forward":
        position += value;
        depth += value * aim;
        break;

      case "up":
        aim -= value;
        break;

      case "down":
        aim += value;
        break;

      default:
        break;
    }
  }
  return position * depth;
}

console.log(`part 1: ${part1()}`);
console.log(`part 2: ${part2()}`);
