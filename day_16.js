let sample;
// sample = `D2FE28`;
// sample = `38006F45291200`;
// sample = `EE00D40C823060`;
sample = `9C0141080250320F1802104A08`;

let h2b = {
  '0': '0000',
  '1': '0001',
  '2': '0010',
  '3': '0011',
  '4': '0100',
  '5': '0101',
  '6': '0110',
  '7': '0111',
  '8': '1000',
  '9': '1001',
  'A': '1010',
  'B': '1011',
  'C': '1100',
  'D': '1101',
  'E': '1110',
  'F': '1111',
};

let b2h = {
  '0000': '0',
  '0001': '1',
  '0010': '2',
  '0011': '3',
  '0100': '4',
  '0101': '5',
  '0110': '6',
  '0111': '7',
  '1000': '8',
  '1001': '9',
  '1010': 'A',
  '1011': 'B',
  '1100': 'C',
  '1101': 'D',
  '1110': 'E',
  '1111': 'F',
};

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
  .filter(e => e.trim() !== '')[0]
  .split('')
  // .map(e => Number(e))
  // .map(e=>e.split(/\s+/))
  ;

function parseLiteral(result) {
  let message = '';
  for (let i = 0; i < result.input.length; i += 5) {
    let end = result.input.slice(i, i + 1);
    let bit = result.input.slice(i + 1, i + 5);
    message += bit;
    if (end === '0') {
      result.input = result.input.slice(i + 5);
      break;
    }
  }
  result.packets[result.packets.length - 1].msg.push(parseInt(message, 2));
  // result.message += parseInt(message, 2);
  return;
}

function parseOperator(result) {
  let lenType = parseInt(result.input.slice(0, 1), 2);
  let len = 0;
  let offset = 0;
  if (lenType == 0) {
    offset = 15;
  } else if (lenType == 1) {
    offset = 11;
  } else {
    throw new Error('Unknown lenType');
  }
  len = parseInt(result.input.slice(1, 1 + offset), 2);
  result.input = result.input.slice(1 + offset);
  parseBits(result);
  return;
}

function parseBits(result) {
  if (result.input.trim() === '' || result.input.match(/^0+$/) !== null) return;
  let version = parseInt(result.input.slice(0, 3), 2);
  result.vTotal += version;
  let type = parseInt(result.input.slice(3, 6), 2);
  result.input = result.input.slice(6);
  let packet = {
    msg: [],
    version,
    type
  }
  // console.log( { version, type, result } );
  result.packets.push(packet);
  if (type == 4) {
    parseLiteral(result);
  } else {
    parseOperator(result);
  }
  return result;
}

function part1() {

  let packets = [];
  let input = '';

  for (var c of data) {
    let d = h2b[c];
    input += d;
  }

  let result = { packets, input, vTotal: 0 };

  while (result.input.trim() !== '' && result.input.match(/^0+$/) === null) {
    parseBits(result);
  }
  return result.vTotal;

}

console.log(`part 1: ${part1()}`);
