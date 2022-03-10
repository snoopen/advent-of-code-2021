let sample = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`;

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

function Line(rawLine) {
  this.start = new Point(rawLine[0]);
  this.end = new Point(rawLine[1]);
}

function Point(rawPoint) {
  this.x = Number(rawPoint[0].trim());
  this.y = Number(rawPoint[1].trim());
}

let data = input
  .split(/\r?\n/)
  .filter(l=>l.trim()!=='')
  .map(e=>e.split(' -> ').map(f=>f.split(','))).map(l=>new Line(l))
;

function countOverlap(lines, dimension) {
  let d2 = dimension === "x" ? "y" : "x";
  let count = 0;
  for (let a = 0; a < lines.length; a++) {
    let lineA = lines[a];
    for (let b = a + 1; b < lines.length; b++) {
      let lineB = lines[b];
      if (lineA.start[d2] === lineB.start[d2]) {
        let min = Math.min(lineA.start[dimension], lineA.end[dimension]);
        let max = Math.max(lineA.start[dimension], lineA.end[dimension]);
        for (let p = min; p < max; p++) {
          if (pointInside(p, lineB.start[dimension], lineB.end[dimension])) {
            count++;
          }
        }
      }

    }
  }
  return count;
}

function pointInside(pc, p1, p2) {
  if (pc >= p1 && pc <= p2) return true;
  if (pc <= p1 && pc >= p2) return true;
  return false;
}

function countIntersects(hlines, vlines) {
  let count = 0;
  for (let hl of hlines) {
    for (let vl of vlines) {
      if ( 
        pointInside(hl.start.y, vl.start.y, vl.end.y) && 
        pointInside(vl.start.x, hl.start.x, hl.end.x) 
      ) {
        count++;
      }
    }
  }
  return count;
}

function part1() {
  let size = 990;
  // let size = 10;
  let grid = Array.from({length: size}, ()=> Array.from({length: size}, ()=> 0));
  let hlines = data.filter(l=>l.start.y===l.end.y);
  let vlines = data.filter(l=>l.start.x===l.end.x);
  let lines = [... hlines, ... vlines];
  for (var line of lines) {
    let xmin = Math.min(line.start.x, line.end.x);
    let xmax = Math.max(line.start.x, line.end.x);
    for (let x = xmin; x <= xmax; x++) {
      let ymin = Math.min(line.start.y, line.end.y);
      let ymax = Math.max(line.start.y, line.end.y);
      for (let y = ymin; y <= ymax; y++) {
        grid[y][x]++;
      }
    }
  }
  let flatten = [];
  grid.forEach(r=>flatten.push(...r));
  return flatten.filter(c=>c>1).length;
}

function getRange(p1, p2) {
  let size = Math.abs(p1-p2)+1;
  let dir = p1 < p2 ? 1 : -1;
  let range = Array.from({length: size}, (v,i)=> p1 + (i*dir));
  return range;
}

function part2() {
  let size = 990;
  // let size = 10;
  let grid = Array.from({length: size}, ()=> Array.from({length: size}, ()=> 0));
  let hlines = data.filter(l=>l.start.y===l.end.y);
  let vlines = data.filter(l=>l.start.x===l.end.x);
  let dlines = data.filter(l=>l.start.x!==l.end.x&&l.start.y!==l.end.y);
  for (var line of hlines) {
    let y = line.start.y;
    for (let x of getRange(line.start.x, line.end.x)) {
      grid[y][x]++;
    }
  }
  for (var line of vlines) {
    let x = line.start.x;
    for (let y of getRange(line.start.y, line.end.y)) {
      grid[y][x]++;
    }
  }
  for (var line of dlines) {
    let ys = getRange(line.start.y, line.end.y);
    let xs = getRange(line.start.x, line.end.x);
    for (let i in ys) {
      let x = xs[i]
      let y = ys[i]
      grid[y][x]++;
    }
  }
  let flatten = [];
  // console.table(grid);
  grid.forEach(r=>flatten.push(...r));
  return flatten.filter(c=>c>1).length;
}

console.log(`part 1: ${part1()}`);
console.log(`part 2: ${part2()}`);
