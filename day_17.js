// let sample = `target area: x=20..30, y=-10..-5`;
let sample = `target area: x=20000..30000, y=-10000..-5000`; // part 3 :-P

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
  .filter(e => e.trim() !== '')[0]
  .split(/[:,] /)
  .slice(1)
  .map(e => e.split(/[\=\.]{1,2}/))
;

function part1() {
  let result;
  for (let v2 = 1; v2 < Math.abs(parseInt(data[1][1])); v2++) {
    let v = v2;
    let y = 0;
    let ymax = 0;
    let range = {
      min: parseInt(data[1][1]),
      max: parseInt(data[1][2]),
    };
    for (let step = 1; step < Number.MAX_SAFE_INTEGER; step++) {
      y += v;
      v--;
      if (y > ymax) {
        ymax = y;

      }
      if (y < range.min) break;
      if (y <= range.max) {
        result = { step, y, v, v2, ymax };
      }
    }
  }
  return result.ymax;
}

function part2() {

  let target = {
    x: {
      min: parseInt(data[0][1]),
      max: parseInt(data[0][2]),
    },
    y: {
      min: parseInt(data[1][1]),
      max: parseInt(data[1][2]),
    },
  };

  let steps = {
    min: 1,
    max: Number.MAX_SAFE_INTEGER,
    range: {},
  };
  let velocities = {
    x: {
      min: Math.floor((2 * target.x.min) ** 0.5),
      max: parseInt(data[0][2]),
      range: {},
    },
    y: {
      min: parseInt(data[1][1]),
      max: Math.abs(parseInt(data[1][1])),
      range: {},
    },
  }

  let y = 0;
  let x = 0;
  let xv = 0;
  let yv = 0;
  let combos = {};

  for (let xvInit = velocities.x.min; xvInit <= velocities.x.max; xvInit++) {
    for (let yvInit = velocities.y.min; yvInit <= velocities.y.max; yvInit++) {
      y = 0;
      x = 0;
      xv = xvInit;
      yv = yvInit;
      for (let step = steps.min; step <= steps.max; step++) {
        let xEnd = step * (((xvInit - step) + xvInit) / 2);
        y += yv;
        if (xv > 0) {
          x += xv;
          xv--;
        }
        yv--;
        if (y < target.y.min) break;
        if (y <= target.y.max && x >= target.x.min && x <= target.x.max) {
          combos[ [xvInit, yvInit] ] = 0;
        }
      }
    }
  }

  return Object.keys(combos).length;

}

console.log(`part 1: ${part1()}`);
console.log(`part 2: ${part2()}`);
