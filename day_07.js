let sample = `16,1,2,0,4,2,7,1,2,14`;

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
  .split(/,/)
  .map(e => parseInt(e))
;

function part1() {
  let result = {
    point: -1,
    delta: -1,
  };
  let min = Math.min(... data);
  let max = Math.max(... data);
  let mid = Math.floor((max - min)/2);

  result.point = mid;
  result.delta = data.reduce((p,v)=>p+(Math.abs(v-mid)),0);

  for (let i = min; i <= max; i++) {
    let res = data.reduce((p,v)=>p+(Math.abs(v-i)),0);
    if (res < result.delta) {
      result.point = i;
      result.delta = res;
    }
  }

  return result;
}

function part2() {
  let result = {
    point: -1,
    delta: -1,
  };
  let min = Math.min(... data);
  let max = Math.max(... data);
  let mid = Math.floor((max - min)/2);

  result.point = mid;
  result.delta = data.map((v)=>Math.abs(v-mid)).map(j=>(1+j)*(j/2)).reduce((p,q)=>p+q,0);

  for (let i = min; i <= max; i++) {
    let res = data.map((v)=>Math.abs(v-i)).map(j=>(1+j)*(j/2)).reduce((p,q)=>p+q,0);
    if (res < result.delta) {
      result.point = i;
      result.delta = res;
    }
  }

  return result;
}

console.log("Part 1:", part1());
console.log("Part 2:", part2());
