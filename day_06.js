let sample = `3,4,3,1,2`;

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

let spawnTime = 6;
let spawnWait = 2;

let fishes = input
  .split(',')
  .map(e => Number(e))
;

function part1() {
  let fishes2 = JSON.parse(JSON.stringify(fishes))
  let days = Array.from({length: 80}, (v,i)=> i);
  let newFish = [];
  for (day of days) {
    for (var index in fishes2) {
      let n = fishes2[index];
      if (n===0) {
        fishes2[index] = spawnTime;
        newFish.push(spawnTime+spawnWait);
      } else {
        fishes2[index]--;
      }
      
    }
    fishes2.push(... newFish);
    newFish = [];
  }
  return fishes2.length;
}

function part2() {
  let dayCount = 256;
  let days = Array.from({length: dayCount+1}, (v,i)=> i);
  let fishDb = Array.from({length: 9}, (_,i)=> 0);
  let fishPtr = Array.from({length: 9}, (_,i)=> Array.from({length: 9}, (_,j)=> (i+j)%9));
  for (let fish of fishes) {
    fishDb[fish]++;
  }
  for (let d of days) {
    let d2 = d % 9;
    let map = fishPtr[d2];

    // Clock 8 was previously clock 0
    // these are fish that need to spawn
    // The number of new fish is the same as
    // fish that need to spawn, so we add
    // this number to the aged pool of 6
    fishDb[map[6]] += fishDb[map[8]];
  
    // printFish(map, fishDb);
  }
  let count = fishDb.reduce((p,v)=>p+=v,0);
  return count;
}

function printFish(map, fishDb) {
  let fishDb2 = Array.from({length: 9}, (_,i)=> fishDb[map[i]]);
  console.table({fishDb2});
}

console.log(`part 1: ${part1()}`);
console.log(`part 2: ${part2()}`);
