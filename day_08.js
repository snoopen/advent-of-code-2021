let s = [];
s[0] = `acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab |
cdfeb fcadb cdfeb cdbaf`;
s[1] = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb |
fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec |
fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef |
cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega |
efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga |
gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf |
gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf |
cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd |
ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg |
gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc |
fgae cfgab fg bagce`;

// choose and clean up sample
let sample = s[1].replace(/\|\n/gi,' | ');

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
  .split(/\n/)
  .filter(e=>e.trim()!=='')
  .map(l=>
    l
    .split(' | ')
    .map(e=>
      e.trim()
      .split(/\s+/)
      .map(alphaSplitSort)
    )
  );

function alphaSort(a,b) {
  return a.charCodeAt(0)-b.charCodeAt(0);
}

function alphaSplitSort(e) {
  return e.split('').sort(alphaSort).join('');
}

function alphatise(input) {
  return input.split('').sort(alphaSort).join('');
}

function delAfromB(a, b) {
  let r = b;
  for (let c of a) {
    b = b.replace(c,'');
  }
  return b;
}

function guessSegments(segs) {

  let n1 = segs.filter(e=>e.length===2)[0];
  let n4 = segs.filter(e=>e.length===4)[0];
  let n7 = segs.filter(e=>e.length===3)[0];
  let n8 = segs.filter(e=>e.length===7)[0];

  // remove digits we know
  let segs2 = segs.filter(e=>e!==n1).filter(e=>e!==n4).filter(e=>e!==n7).filter(e=>e!==n8);

  // #6 without #1 is the only digit to go from len 6 to len 5
  let n6 = segs2.filter(e=>e.length===6).filter(f=>delAfromB(n1, f).length === 5)[0];
  segs2 = segs2.filter(e=>e!==n6);

  let a = delAfromB(n1, n7);
  let c = delAfromB(n6, n1);
  let f = delAfromB(c, n1);
  let bd = delAfromB(n1, n4);

  // with the remaining numbers, we can determine that the next 6 len seg without A B C D parts is #0
  let n0 = segs2.filter(e=>e.length===6).filter(f=>delAfromB(a + c + bd, f).length === 3)[0];
  segs2 = segs2.filter(e=>e!==n0);
  let d = delAfromB(n0, bd);
  let b = delAfromB(d, bd);

  let n9 = segs2.filter(e=>e.length===6)[0];
  segs2 = segs2.filter(e=>e!==n9);
  let g = delAfromB(a + n4, n9);
  let e = delAfromB(n9, n8);

  // at this point we're left with only numbers with 5 segments, 2, 3 & 5
  // tho we can just construct them ourselves

  let n2 = alphatise(a+c+d+e+g);
  let n3 = alphatise(a+c+d+f+g);
  let n5 = alphatise(a+b+d+f+g);

  segs2 = segs2.filter(e=>e!==n2).filter(e=>e!==n3).filter(e=>e!==n5);

  return {
    [n0]: 0,
    [n1]: 1,
    [n2]: 2,
    [n3]: 3,
    [n4]: 4,
    [n5]: 5,
    [n6]: 6,
    [n7]: 7,
    [n8]: 8,
    [n9]: 9,
  };
}

//   a0
// b1  c2
// b1  c2
//   d3
// e4  f5
// e4  f5
//   g6

// #0 [a,b,c,  e,f,g]   6
// #1 [  b,      f  ] ! 2
// #2 [a,  c,d,e,  g]   5
// #3 [a,  c,d,  f,g]   5
// #4 [  b,c,d,  f  ] ! 4
// #5 [a,b,  d,  f,g]   5
// #6 [a,b,  d,e,f,g]   6
// #7 [a,  c,    f  ] ! 3
// #8 [a,b,c,d,e,f,g] ! 7
// #9 [a,b,c,d,  f,g]   6

// 1,4,7,8 are unique
// so we can assign those and use them to deduce others

// #7 - #1 = a
// #4 - #7 = b,d
// etc...

function part1() {
  let result = 0;
  let want = [1,4,7,8];

  for (var line of data) {
    let segs = guessSegments(line[0]);
    for (var num of line[1]) {
      let res = segs[num];
      if (want.includes(res)) result++;
    }
  }
  return result;
}

function part2() {
  let result = 0;

  for (var line of data) {
    let segs = guessSegments(line[0]);
    let nums = [];
    for (var num of line[1]) {
      let res = segs[num];
      nums.push(res + '');
    }
    result += parseInt(nums.join(''));
  }
  return result;
}

console.log(`part 1: ${part1()}`);
console.log(`part 2: ${part2()}`);
