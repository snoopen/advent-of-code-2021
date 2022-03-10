let sample;
sample = `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###
`;

// sample = `#.#.##..#..#..###.#.#....#.########.#.##.#..#.###..###.##.#.##.#.#.....#..##.#.#..###.###.######..#.#..#######.#..#....####..###.####.###.#.#######.#...#...#.##.###..###..##.#.#.###........##.#.....#.##.#.####...#...#.#..###.#.#...#....#...####..#.########.#...#.####.#####..#.#.###......#.##...###..##..#.#..#....#..###.#.##.....##.#####..##.####.#.###....##.###...#.##....##.#..#.#..#..#.##...#.##..#####.####.#.##...##...##...#.##.#.#.####..##...#.....#......#.#......#..###..#..##..##.###..#####..#..##.#..#.

// .....
// ....#
// #.#..
// ....#
// #...#
// `;

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

let near = [
  [-1,-1],
  [ 0,-1],
  [ 1,-1],
  [-1, 0],
  [ 0, 0],
  [ 1,0 ],
  [-1, 1],
  [ 0, 1],
  [ 1, 1],
];

let data = input
  .split(/\r?\n/)
;
let sindex = data.indexOf('');
let enhanceData = data.slice(0,sindex)[0];
let imageData = data.slice(sindex).filter(e=>e.trim()!=='').map(e=>e.split(''));

function readPixel(input, x, y, trim) {
  y = y * 1;
  x = x * 1;
  let b = '';
  let p;
  for (let n of near) {
    p = trim % 2 == 0 ? '.' : '#';
    if (input[y+n[1]]) {
      p = input[y+n[1]][x+n[0]];
    }
    b += p === '#' ? '1' : '0';
  }
  return parseInt(b,2);
}

// ---
// -O-
// ---

// ...
// ...
// ...

function enhance(input, trim) {
  let count = 0;
  let output = Array.from({length: input.length}, () => Array.from({length: input[0].length}, () => '.'));
  for (let y = 0 + trim; y < output.length - trim; y++) {
    for (let x = 0 + trim; x < output[0].length - trim; x++) {
      let e = readPixel(input, x, y, trim);
      let p = enhanceData[e];
      if ((p) === '#' ) count++;
      output[y][x] = p;
    }
  }
  return output;
}

function part1() {
  let steps = 2;
  let size = 10;
  let pad = (size*steps);
  let input = Array.from({length: imageData.length+pad}, () => Array.from({length: imageData[0].length+pad}, () => '.'));
  for (let y = 0; y < imageData.length; y++) {
    for (let x = 0; x < imageData[0].length; x++) {
      input[y+size][x+size] = imageData[y][x];
    }
  }
  let enhanced = input;
  for (let i = 1; i <= steps; i++) {
    enhanced = enhance(enhanced,i);
  }
  let d = enhanced.map(e=>e.join('')).join('').replace(/\./g,'').length;
  // console.log(enhanced.map(e=>e.join('')).join('\n'));
  return d;
}

function part2() {
  let steps = 50;
  let size = 4;
  let pad = (size*steps);
  let input = Array.from({length: imageData.length+pad}, () => Array.from({length: imageData[0].length+pad}, () => '.'));
  for (let y = 0; y < imageData.length; y++) {
    for (let x = 0; x < imageData[0].length; x++) {
      input[y+(pad/2)][x+(pad/2)] = imageData[y][x];
    }
  }
  let enhanced = input;
  for (let i = 1; i <= steps; i++) {
    enhanced = enhance(enhanced,i);
  }
  let d = enhanced.map(e=>e.join('')).join('').replace(/\.|\n/g,'').length;
  //printImage(enhanced, (steps*2-size*2));
  return d;
}

function printImage(image, trim) {
  let output = Array.from({length: image.length-trim}, () => Array.from({length: image[0].length-trim}, () => '.'));
  for (let y = 0; y < output.length; y++) {
    for (let x = 0; x < output[0].length; x++) {
      output[y][x] = image[y+(trim/2)][x+(trim/2)];
    }
  }
  console.log(output.map(e=>e.join('')).join('\n'));
}

console.log(`part 1: ${part1()}`);
console.log(`part 2: ${part2()}`);
