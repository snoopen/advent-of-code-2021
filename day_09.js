let sample = `2199943210
3987894921
9856789892
8767896789
9899965678
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
  .map(e=>e.split('').map(n => Number(n)))
;

// with diagonals
let near = [
  [-1,-1],
  [ 0,-1],
  [ 1,-1],
  [-1, 0],
  [ 1,0 ],
  [-1, 1],
  [ 0, 1],
  [ 1, 1],
];

// no diagonals
let near2 = [
  [ 0,-1],
  [-1, 0],
  [ 1,0 ],
  [ 0, 1],
];

function getNeighbours(x,y) {
  x = parseInt(x);
  y = parseInt(y);
  let neighbours = [];
  for (let n of near) {
    let p = getPoint(x+n[0], y+n[1]);
    if (typeof p !== 'undefined') {
      neighbours.push(p);
    }
  }
  return neighbours;
}

function getPoint(x,y) {
  let d = data[y];
  if (d) return d[x];
  return;
}

function part1() {
  let result = 0;
  let lows = [];
  for (var y in data) {
    let row = data[y];
    for (let x in row) {
      let point = getPoint(x,y);
      let others = getNeighbours(x,y);
      if (others.every(n=>n>point)) lows.push(point);
    }
  }
  result = lows.reduce((p,v)=>p+v+1,0);
  return result;
}

function checkAround(x, y, neighbours) {
  x = parseInt(x);
  y = parseInt(y);
  let newNeighbours = {};
  for (let n of near2) {
    let x1 = x+n[0];
    let y1 = y+n[1];
    if (
      (x1 >= 0 && x1 < data[0].length) &&
      (y1 >= 0 && y1 < data.length)
    ) {
      let key = getKey(x1, y1);
      if (typeof neighbours[key] === 'undefined') {
        newNeighbours[key] = {
          coord: [x1,y1],
          value: getPoint(x1,y1),
        };
      }
    }
  }
  return newNeighbours;
}

function getKey(x, y) {
  return x + ':' + y;
}

function part2() {
  let result = 0;

  // get low points first
  let lows = [];
  for (var y in data) {
    y = parseInt(y);
    let row = data[y];
    for (let x in row) {
      x = parseInt(x);
      let point = getPoint(x,y);
      let others = getNeighbours(x,y);
      if (others.every(n=>n>point)) {
        lows.push({
          coord: [x,y],
          value: getPoint(x,y),
        });
      }
    }
  }

  let stash = [];

  for (let low of lows) {
    let neighbours = {};
    let newNeighbours = {};
    let x = low.coord[0];
    let y = low.coord[1];
    let key = getKey(x,y);
    let point = low.value;
    let loop = true;
    let limit = 1000;

    newNeighbours[key] = {
      coord: [x,y],
      value: getPoint(x,y),
    };

    while (loop) {
      loop = false;
      let newNewNeighbours = {};
      for (nbrKey in newNeighbours) {
        limit--;
        if (limit < 1) throw new Error('boo');
        let nbr = newNeighbours[nbrKey];
        x = nbr.coord[0];
        y = nbr.coord[1];
        key = getKey(x,y)
        point = getPoint(x,y);
        if (typeof neighbours[key] === 'undefined' && point < 9) {
          Object.assign(neighbours, {[nbrKey]: nbr});
          delete newNeighbours[nbrKey];
          Object.assign(newNewNeighbours, checkAround(x, y, neighbours));
          if (Object.keys(newNewNeighbours).length>0) loop = true;
        }
      }
      Object.assign(newNeighbours, newNewNeighbours);
      
    }
    stash.push(Object.entries(neighbours).length);

  }

  result = stash.sort((a,b)=>b-a).slice(0,3).reduce((p,v)=>p*v,1);
  return result;
}

console.log(`part 1: ${part1()}`);
console.log(`part 2: ${part2()}`);
