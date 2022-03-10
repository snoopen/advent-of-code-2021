// TODO: Write a puzzle input parser rather than using hand decoded values

const logicMap = [
  [ 1, 100,   1],    // +1 00
  [ 1, 100,   9],    // +2 01
  [ 1, 100,  12],    // +3 02
  [ 1, 100,   6],    // +4 03
  [26,  -6, 100],    // -4 04
  [26, -14, 100],    // -3 05
  [ 1, 100,   7],    // +5 06
  [ 1, 100,  12],    // +6 07
  [26,  -8, 100],    // -6 08
  [26, -15, 100],    // -5 09
  [ 1, 100,   6],    // +7 10
  [26, -11, 100],    // -7 11
  [26, -13, 100],    // -2 12
  [26,  -4, 100],    // -1 13
];

const pairMap = [
  [ 0, 13],  // 1
  [ 1, 12],  // 2
  [ 2,  5],  // 3
  [ 3,  4],  // 4
  [ 6,  9],  // 5
  [ 7,  8],  // 6
  [10, 11],  // 7
];

function solver() {
  let inputMax = Array.from({length:14},()=>9);
  let inputMin = Array.from({length:14},()=>1);
  for (let m of pairMap) {
    let left = m[0];
    let right = m[1];
    let a = logicMap[left];
    let b = logicMap[right];
    let delta = a[2] + b[1];
    if (delta < 0) {
      inputMax[right] += delta;
      inputMin[left] -= delta;
    } else if (delta > 0) {
      inputMax[left] -= delta;
      inputMin[right] += delta;
    }
  }

  console.assert(computer(inputMax).z === 0);
  console.assert(computer(inputMin).z === 0);

  inputMax = parseInt(inputMax.join(''));
  inputMin = parseInt(inputMin.join(''));

  console.log(`part 1: ${inputMax}`);
  console.log(`part 2: ${inputMin}`);

}

function computer(input) {
  let w = 0;
  let x = 0;
  let y = 0;
  let z = 0;

  for (let i = 0; i < 14; i++) {
    w = input[i];
    x = z % 26;
    z = Math.floor(z / logicMap[i][0]); //!
    x = x + logicMap[i][1]; //!
    x = x !== w ? 1 : 0;
    y = 25 * x + 1;1
    z = z * y;
    y = (w + logicMap[i][2]) * x; //!
    z = z + y;
  }
  return {w,x,y,z};
}

solver();
