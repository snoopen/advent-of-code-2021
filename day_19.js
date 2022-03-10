let all_timer = process.hrtime();

var elapsed_time = function (hrtime, note) {
  var us_elapsed = process.hrtime(hrtime)[0] * 1000000 + process.hrtime(hrtime)[1] / 1000;
  return us_elapsed;
}
// let { performance } = require("perf_hooks");
// const pStart = performance.now();
let sample = ``;
let answer1;
let answer2;

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

let data = input.split(/\r?\n/);

function jps(obj){return JSON.parse(JSON.stringify(obj))};

const rotator = [
  function({x,y,z, ... rest}){return jps({ x:  x, y:  y, z:  z, ... rest })}, //  0
  function({x,y,z, ... rest}){return jps({ x: -y, y:  x, z:  z, ... rest })}, //  1
  function({x,y,z, ... rest}){return jps({ x: -x, y: -y, z:  z, ... rest })}, //  2
  function({x,y,z, ... rest}){return jps({ x:  y, y: -x, z:  z, ... rest })}, //  3
  function({x,y,z, ... rest}){return jps({ x:  z, y:  y, z: -x, ... rest })}, //  4
  function({x,y,z, ... rest}){return jps({ x: -y, y:  z, z: -x, ... rest })}, //  5
  function({x,y,z, ... rest}){return jps({ x: -z, y: -y, z: -x, ... rest })}, //  6
  function({x,y,z, ... rest}){return jps({ x:  y, y: -z, z: -x, ... rest })}, //  7
  function({x,y,z, ... rest}){return jps({ x: -x, y:  y, z: -z, ... rest })}, //  8
  function({x,y,z, ... rest}){return jps({ x: -y, y: -x, z: -z, ... rest })}, //  9
  function({x,y,z, ... rest}){return jps({ x:  x, y: -y, z: -z, ... rest })}, // 10
  function({x,y,z, ... rest}){return jps({ x:  y, y:  x, z: -z, ... rest })}, // 11
  function({x,y,z, ... rest}){return jps({ x: -z, y:  y, z:  x, ... rest })}, // 12
  function({x,y,z, ... rest}){return jps({ x: -y, y: -z, z:  x, ... rest })}, // 13
  function({x,y,z, ... rest}){return jps({ x:  z, y: -y, z:  x, ... rest })}, // 14
  function({x,y,z, ... rest}){return jps({ x:  y, y:  z, z:  x, ... rest })}, // 15
  function({x,y,z, ... rest}){return jps({ x:  x, y: -z, z:  y, ... rest })}, // 16
  function({x,y,z, ... rest}){return jps({ x:  z, y:  x, z:  y, ... rest })}, // 17
  function({x,y,z, ... rest}){return jps({ x: -x, y:  z, z:  y, ... rest })}, // 18
  function({x,y,z, ... rest}){return jps({ x: -z, y: -x, z:  y, ... rest })}, // 19
  function({x,y,z, ... rest}){return jps({ x: -x, y: -z, z: -y, ... rest })}, // 20
  function({x,y,z, ... rest}){return jps({ x:  z, y: -x, z: -y, ... rest })}, // 21
  function({x,y,z, ... rest}){return jps({ x:  x, y:  z, z: -y, ... rest })}, // 22
  function({x,y,z, ... rest}){return jps({ x: -z, y:  x, z: -y, ... rest })}, // 23
];

function getScanners() {
  let r = new RegExp(/(-?[\d]+,){2}(-?[\d]+)/);
  let scanners = [];
  let scanner;
  for (var line of data) {
    if (r.test(line)) {
      if (!scanner) scanner = { beacons: [], dists: [], placed: false };
      let [x, y, z] = line.trim().split(',').map(e=>e*1);
      scanner.beacons.push({ x, y, z, distIndexes: [] });
    } else {
      if (scanner) scanners.push(scanner);
      scanner = undefined;
    }
  }
  return scanners;
}

function calcDist(point1, point2) {
  return (point1.x - point2.x)**2 + (point1.y - point2.y)**2 + (point1.z - point2.z)**2;
}

function addDeltas(scanners) {
  let i = -1;
  for (let scanner of scanners) {
    i++;
    for (let beaconIndex1 in scanner.beacons) {
      beaconIndex1 = beaconIndex1 * 1;
      let beaconA = scanner.beacons[beaconIndex1];
      for (let beaconIndex2 = beaconIndex1 + 1; beaconIndex2 < scanner.beacons.length; beaconIndex2++) {
        let beaconB = scanner.beacons[beaconIndex2];
        if (beaconA !== beaconB) {
          let lengthAB = calcDist(beaconA, beaconB);
          let lengthBA = calcDist(beaconB, beaconA);
          let diffAB = {
            x: beaconA.x - beaconB.x,
            y: beaconA.y - beaconB.y,
            z: beaconA.z - beaconB.z,
          };
          let diffBA = {
            x: beaconB.x - beaconA.x,
            y: beaconB.y - beaconA.y,
            z: beaconB.z - beaconA.z,
          };
          scanner.dists.push({ a: beaconIndex1, b: beaconIndex2, i, length: lengthAB, diff: diffAB, dir: 'AB' });
          scanner.dists.push({ a: beaconIndex2, b: beaconIndex1, i, length: lengthBA, diff: diffBA, dir: 'BA' });
        }
      }
    }
  }
}

function coordMatch(coord1, coord2) {
  return coord1.x === coord2.x &&
         coord1.y === coord2.y &&
         coord1.z === coord2.z;
}

function rotateScanner(scanner, rot) {
  let result = JSON.parse(JSON.stringify(scanner));
  result.beacons = result.beacons.map(beacon=>{
    return Object.assign(beacon, rot(beacon));
  });
  result.dists = result.dists.map(dist=>{
    let diff = rot(dist.diff);
    return Object.assign(dist, {diff});
  });
  return result;
}

// calculated number of edges between given number of points
function edges(points) { return (points*0.5)*(points-1) };

function getAlignedScanners() {
  let scanners = getScanners();
  addDeltas(scanners);
  // let rotationList = createRotationList();

  let a = 0;
  scanners[a].placed = true;
  let placed = [ scanners[a] ];
  placed[0].offset = { x: 0, y: 0, z: 0, i: '0' };
  
  while (scanners.filter(e=>e.placed===false).length > 0) {
    for (let scannerIndex in scanners) {
      let scanner = scanners[scannerIndex];
      if (scanner.placed) continue;
      for (let place of placed) {
        
        // test if lengths are equal enough between known scanner and current scanner
        let testLength = [];
        place.dists.filter(e=>e.dir==='AB').forEach(placeDist => {
          let match = scanner.dists.filter( scannerDist => placeDist.length === scannerDist.length);
          if (match.length > 0) testLength.push({ placeDist, scannerDist: match[0] });
        });

        // We calculated all edges between all points. We require 12 of those
        // points to edges to other points that are equal. There are 66 edges
        // when all 12 points are connected.
        if (testLength.length >= 66) {

          // rotate current scanner and try and align it to known scanner
          for (let rot of rotator) {
            // let rotated = rotateScanner(scanner, rot);
            let rotated = rotateScanner(scanner, rot);

            // test if the current scanner rotated has edge coordinate
            // differentials that match those of the known scanner.
            let testRotate = [];
            place.dists.filter(e=>e.dir==='AB').forEach(placeDist => {
              let match = rotated.dists.filter( scannerDist => coordMatch(placeDist.diff, scannerDist.diff));
              if (match.length > 0) testRotate.push({ placeDist, scannerDist: match[0] });
              if (match.length > 1) console.log(match.length)
            });

            // again, we should have 66 matches since we using the full list
            // of edge differentials
            if (testRotate.length>=66) {
              // yay, current scanner rotated aligns with the current scanner!
              scanner.placed = true;
              // pick the first matching point and calculate current scanner
              // offset
              let matchDist = testRotate[0];
              let x = rotated.beacons[matchDist.scannerDist.a].x - place.beacons[matchDist.placeDist.a].x;
              let y = rotated.beacons[matchDist.scannerDist.a].y - place.beacons[matchDist.placeDist.a].y;
              let z = rotated.beacons[matchDist.scannerDist.a].z - place.beacons[matchDist.placeDist.a].z;
              x += place.offset.x;
              y += place.offset.y;
              z += place.offset.z;
              rotated.offset = { x, y, z, i: scannerIndex, vs: place.offset.i };
              placed.push(rotated);
              break;
            }
          }
          break;
        }
      }
    }
  }
  return placed;
}

function solvePart1AndPart2() {
  let scanners = getAlignedScanners();
  let beacons = {};

  scanners = scanners.sort((a,b)=>(a.offset.i*1)-(b.offset.i*1));

  for (let scanner of scanners) {
    for (let beacon of scanner.beacons) {
      let x = beacon.x - scanner.offset.x;
      let y = beacon.y - scanner.offset.y;
      let z = beacon.z - scanner.offset.z;
      let key = JSON.stringify({x,y,z});
      if (typeof beacons[key] === 'undefined') {
        beacons[key] = {x,y,z};
      }
    }
  }
  let largest = 0;
  for (let s1 in scanners) {
    s1 *= 1;
    for (let s2 = s1 + 1; s2 < scanners.length; s2++) {
      let dist = calcManhattanDist(scanners[s1], scanners[s2]);
      if (dist > largest) largest = dist;
    }
  }
  answer1 = Object.getOwnPropertyNames(beacons).length;
  answer2 = largest;
}

function calcManhattanDist(scanner1, scanner2) {
  return Math.abs(scanner1.offset.x - scanner2.offset.x) +
    Math.abs(scanner1.offset.y - scanner2.offset.y) +
    Math.abs(scanner1.offset.z - scanner2.offset.z);
}

solvePart1AndPart2()

console.log(`part 1: ${answer1}`);
console.log(`part 2: ${answer2}`);

// console.log(createRotationList());

// const pEnd = performance.now();
// console.log(pEnd - pStart);
console.log(`overall time: ${(elapsed_time(all_timer)/1000).toFixed(1)}ms`)