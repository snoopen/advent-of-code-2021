let sample = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5
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
  .split(/\r?\n\r?\n/)
  .map(e =>
    e.split(/\r?\n/)
    .filter(e => e.trim() !== '')
  )
;

let coords = data[0].map(e => e.split(",").map(e => parseInt(e)));
let folds = data[1];

function Point(x, y) {
  return {
    x,
    y,
  }
}

function Grid() {
  return {
    points: [],
    xMax: 0,
    yMax: 0,
  };
}

function genReport(grid) {
  let countHash = 0;
  let dispGrid = Array.from({
    length: grid.yMax + 1
  }, (v, i) => Array.from({
    length: grid.xMax + 1
  }, (v, i) => " "));
  for (point of grid.points) {
    if (dispGrid[point.y][point.x] !== "#") countHash++;
    dispGrid[point.y][point.x] = "#";
  }
  let countDot = (grid.xMax + 1) * (grid.yMax + 1) - countHash;
  return {
    dispGrid,
    countHash,
    countDot
  }
}

function part1and2(part2) {

  let grid = new Grid();

  for (var c of coords) {
    let x = c[0];
    let y = c[1];
    grid.points.push(new Point(x, y));
    if (grid.xMax < x) grid.xMax = x;
    if (grid.yMax < y) grid.yMax = y;
  }

  for (fold of folds) {
    fold = fold.split(" ");
    let f = fold[2].split("=");
    f[1] = parseInt(f[1]);
    grid = doFold(f[0], f[1], grid);
    if (!part2) break;
  }

  let report = genReport(grid);

  if (part2) console.table('\n' + report.dispGrid.map(e => e.join('')).join('\n') + '\n');

  return report.countHash;
}

function doFold(axis, coord, grid) {
  let xMax = grid.xMax;
  let yMax = grid.yMax;
  if (axis === "x") {
    xMax = coord - 1;
  } else if (axis === "y") {
    yMax = coord - 1;
  }
  let points = Array.from(grid.points);
  for (let point of points) {
    if (point[axis] > coord) {
      point[axis] = coord - (point[axis] - coord);
    }
  }
  let newGrid = {
    points,
    xMax,
    yMax,
  }
  return newGrid;
}

console.log(`part 1: ${part1and2(false)}`);
console.log(`part 2: ${part1and2(true)}`);
