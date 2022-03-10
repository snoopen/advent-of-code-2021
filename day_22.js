let all_timer = process.hrtime();

var elapsed_time = function (hrtime) {
  var us_elapsed = process.hrtime(hrtime)[0] * 1000000 + process.hrtime(hrtime)[1] / 1000;
  return us_elapsed;
}

let sample = `on x=10..12,y=10..12,z=10..12
on x=11..13,y=11..13,z=11..13
off x=9..11,y=9..11,z=9..11
on x=10..10,y=10..10,z=10..10
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
  .map(e => e.split(/[ ,]/)
    .map((e, i) => i === 0 ? e : e.split(/\.\.|=/)
      .map((e, i) => i === 0 ? e : parseInt(e))
    )
  )
;

function asc(a, b) {
  return a - b;
}

let Axis = {
  x: 'x',
  y: 'y',
  z: 'z',
};

let Extents = {
  min: 'min',
  max: 'max',
};

let limits = {
  x: { min: null, max: null, },
  y: { min: null, max: null, },
  z: { min: null, max: null, },
}

function Cube(cubeVals) {
  let [minX, maxX] = [ 1, 0 ];
  let [minY, maxY] = [ 1, 0 ];
  let [minZ, maxZ] = [ 1, 0 ];
  let type = '';
  if (cubeVals) {
    [minX, maxX] = [ cubeVals[1][1], cubeVals[1][2] ].sort(asc);
    [minY, maxY] = [ cubeVals[2][1], cubeVals[2][2] ].sort(asc);
    [minZ, maxZ] = [ cubeVals[3][1], cubeVals[3][2] ].sort(asc);
    type = cubeVals[0];
  }
  return {
    x: { min: minX-1, max: maxX, },
    y: { min: minY-1, max: maxY, },
    z: { min: minZ-1, max: maxZ, },
    // size: maxX - (minX-1), c: (minX-1) + (( maxX - (minX-1) ) / 2 )
    // size: maxY - (minY-1), c: (minY-1) + (( maxY - (minY-1) ) / 2 )
    // size: maxZ - (minZ-1), c: (minZ-1) + (( maxZ - (minZ-1) ) / 2 )
    type,
    intersects: [],
    clone: function () {
      let cube = new Cube();
      cube.x.min = this.x.min;
      cube.y.min = this.y.min;
      cube.z.min = this.z.min;
      cube.x.max = this.x.max;
      cube.y.max = this.y.max;
      cube.z.max = this.z.max;
      cube.type = this.type;
      return cube;
    },
    getSize: function () {
      let x = this.x.max - this.x.min;
      let y = this.y.max - this.y.min;
      let z = this.z.max - this.z.min;
      return { x, y, z };
    },
    getVolume: function () {
      let size = this.getSize();
      return size.x * size.y * size.z;
    },
  };
}

function cubesIntersect(a, b) {
  return (a.x.min < b.x.max && a.x.max > b.x.min) &&
         (a.y.min < b.y.max && a.y.max > b.y.min) &&
         (a.z.min < b.z.max && a.z.max > b.z.min);
}

function cubesIntersectStrict(a, b) {
  return (a.x.min <= b.x.max && a.x.max >= b.x.min) &&
         (a.y.min <= b.y.max && a.y.max >= b.y.min) &&
         (a.z.min <= b.z.max && a.z.max >= b.z.min);
}

function sweepCubes(cubes, tool, invert) {
  let newCubes = [];
  for (let subCube of cubes) {
    let intersect = cubesIntersect(subCube, tool);
    if (intersect === invert) {
      newCubes.push(subCube);
    }
  }
  return newCubes;
}

// TODO: this is a mess
function splitCubes(cubes, tool, keep, invert) {
  for (let extent in Extents) {
    for (let axis in Axis) {
      let newCubes = [];
      for (let subCube of cubes) {
        let intersect = cubesIntersect(subCube, tool);
        if (intersect) {
          let result = splitCubeSub(subCube, tool, axis, extent);
          if (result) newCubes.push(... result);
        } else {
          newCubes.push(subCube);
        }
      }
      cubes = newCubes;
    }
  }
  cubes = sweepCubes(cubes, tool, invert);
  if (keep) cubes.push(tool);
  return cubes;
}

function splitCubeSub(cube, tool, axis, extent) {
  let knife = tool[axis][extent];
  if (knife > cube[axis].min && knife < cube[axis].max) {
    let c1 = cube.clone();
    let c2 = cube.clone();
    c1[axis].max = knife;
    c2[axis].min = knife;
    return [c1, c2];
  }
  return [cube];
}

function getRebootCube() {
  let rebootCube = new Cube();
  rebootCube.x.min = -50;
  rebootCube.x.max = 50;
  rebootCube.y.min = -50;
  rebootCube.y.max = 50;
  rebootCube.z.min = -50;
  rebootCube.z.max = 50;
  return rebootCube;
}

function calculateIntersects(cubes) {
  for (let i = 0; i < cubes.length; i++) {
    for (let j = i + 1; j < cubes.length; j++) {
      if (cubesIntersect(cubes[i], cubes[j])) {
        cubes[i].intersects.push(j);
        cubes[j].intersects.push(i);
      }
    }
  }
}

function part1() {
  let cubes = [];
  let cube;

  let rebootCube = getRebootCube();

  for (var line of data) {
    cube = new Cube(line);
    if (!cubesIntersect(cube, rebootCube)) {
      // do nothing, ignore these cubes
    } else if (cube.type === 'on') {
    // if (cube.type === 'on') {
      // cubes.push(cube);
      if (cubes.length === 0) {
        cubes.push(cube)
      } else {
        cubes = splitCubes(cubes, cube, true, false);
      }
    } else {
      cubes = splitCubes(cubes, cube, false, false);
    }
  }

  let volume = 0;
  for (let cube of cubes) {
    volume += cube.getVolume();
  }
  return volume;
}

function part2() {
  let cubes = [];
  let cube;

  let rebootCube = getRebootCube();

  for (var line of data) {
    cube = new Cube(line);
    if (cube.type === 'on') {
      // cubes.push(cube);
      if (cubes.length === 0) {
        cubes.push(cube)
      } else {
        cubes = splitCubes(cubes, cube, true, false);
      }
    } else {
      cubes = splitCubes(cubes, cube, false, false);
    }
  }

  let volume = 0;
  for (let cube of cubes) {
    volume += cube.getVolume();
  }
  return volume;
}

console.log(`part 1: ${part1()}`);
console.log(`part 2: ${part2()}`);

console.log(`overall time: ${(elapsed_time(all_timer)/1000).toFixed(1)}ms`)