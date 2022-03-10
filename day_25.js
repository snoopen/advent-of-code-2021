let sample = `v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>
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
  .filter(e => e.trim() !== '')
  .map(e => e.split(''));

function part1() {
  let gaps = [];
  let rowMax = data.length - 1;
  let colMax = data[0].length - 1;
  for (var row in data) {
    row = rowMax - (row * 1);
    for (var col in data[row]) {
      col = colMax - (col * 1);
      if (data[row][col] === '.') {
        gaps.push({ r: row, c: col });
      }
    }
  }
  // console.log(data.map(e=>e.join('')));

  let count = 0;
  while (true) {
    let lefts = [];
    let ups = [];
    for (let gap of gaps) {
      let leftCol = (gap.c - 1 + (colMax + 1)) % (colMax + 1);
      if (data[gap.r][leftCol] === '>') {
        data[gap.r][gap.c] = 'l';
        data[gap.r][leftCol] = '.';
        lefts.push({ r: gap.r, c:gap.c });
        gap.c--;
        if (gap.c < 0) gap.c = colMax;
      }
    }

    for (let gap of gaps) {
      let upRow = (gap.r - 1 + (rowMax + 1)) % (rowMax + 1);
      if (data[upRow][gap.c] === 'v') {
        data[gap.r][gap.c] = 'd';
        data[upRow][gap.c] = '.';
        ups.push({ r: gap.r, c:gap.c });
        gap.r--;
        if (gap.r < 0) gap.r = rowMax;
      }
    }

    lefts.forEach(e=>data[e.r][e.c]='>');
    ups.forEach(e=>data[e.r][e.c]='v');
    count++;
    if (lefts.length === 0 && ups.length === 0) break;
  }

  // ooo pretty
  console.log(data.map(e=>e.join('')).join('\n'));
  return count;
}

console.log(`final part, yey: ${part1()}`);
