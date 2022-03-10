let sample;
// sample = `D2FE28`;
// sample = `38006F45291200`;
// sample = `EE00D40C823060`;
sample = `9C0141080250320F1802104A08`;

let trace = false;

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

const fs = require('fs');
let input;
if (process.argv[2] === "sample") {
  input = sample;
} else {
  let day = process.argv[2] ? process.argv[2] : '16';
  let filename = `input/day_${day}.txt`;
  input = fs
    .readFileSync(filename)
    .toString();
}

let data = input
  .split(/\r?\n/)
  .filter(e => e.trim() !== '')[0]
  .split('')
;

function parseLiteral(bits) {
  trace && console.log('parseLiteral');
  let raw = '';
  for (let i = 0; i < bits.length; i += 5) {
    let end = bits.slice(i, i + 1);
    let seg = bits.slice(i + 1, i + 5);
    raw += seg;
    if (end === '0') {
      bits = bits.slice(i + 5);
      break;
    }
  }
  let result = parseInt(raw, 2);
  return { result, bits };
}

function parseOperator(bits) {
  trace && console.log('parseOperator');
  let lenType = parseInt(bits.slice(0, 1), 2);
  let offset = 0;
  let lengthLimit;
  let packetLimit;
  if (lenType == 0) {
    offset = 15; // bit length
    lengthLimit = parseInt(bits.slice(1, offset + 1), 2);
  } else if (lenType == 1) {
    offset = 11; // packet count
    packetLimit = parseInt(bits.slice(1, offset + 1), 2);
  } else {
    throw new Error('Unknown lenType');
  }
  
  // console.log(len)
  // bits = bits.slice(offset + 1);
  let newBits = bits.slice(offset + 1);
  let output = parseBits(newBits, lengthLimit, packetLimit);
  let l = newBits.length - output.bits.length;
  bits = bits.slice(offset + 1 + l);
  let result = output.result;
  return { result, bits };
}

function parseBits(bits, lengthLimit, packetLimit) {
  trace && console.log('parseBits');
  let result = [];
  let output;
  let consumed = 0;
  let packetCount = 0;
  let len = bits.length;
  lengthLimit = lengthLimit || 99999;
  packetLimit = packetLimit || 99999;
  while ( bits.length > 5 && bits.match(/^0+$/) === null ) {
  // while (bits.length > 5) {
    let version = parseInt(bits.slice(0, 3), 2);
    let type = parseInt(bits.slice(3, 6), 2);
    bits = bits.slice(6);
    // console.log({ type, version, bits });
    if (type == 4) {
      output = parseLiteral(bits);
    } else {
      output = parseOperator(bits);
    }
    bits = output.bits;
    result.push({ type, version, result: output.result });
    consumed = len - bits.length;
    packetCount++;
    if (consumed >= lengthLimit) break;
    if (packetCount >= packetLimit) break;
  }
  return { result, bits };
}

function crunchVersions(result) {
  let v = result.version;
  if (result.type !== 4) {
    for (let res of result.result) {
      v += crunchVersions(res);
    }
  }
  return v;
}

function crunchPackets(result) {
  let total = 0;
  let values;
  // console.log(result.type)
  if (result.type === 4) {
    total = result.result;
  } else {
    values = [];
    for (let res of result.result) {
      values.push(crunchPackets(res));
    }
    // 4 VALUE
    // 0 sum
    // 1 product
    // 2 min
    // 3 max
    // 5 greater than
    // 6 less than
    // 7 equal to
    if (result.type === 0) {
      total = values.reduce((p,v)=>p+v,0);
    } else if (result.type === 1) {
      total = values.reduce((p,v)=>p*v,1);
    } else if (result.type === 2) {
      total = Math.min(...values);
    } else if (result.type === 3) {
      total = Math.max(...values);
    } else if (result.type === 5) {
      total = values[0] > values[1] ? 1 : 0;
    } else if (result.type === 6) {
      total = values[0] < values[1] ? 1 : 0;
    } else if (result.type === 7) {
      total = values[0] == values[1] ? 1 : 0;
    } else {
      console.log(result);
      throw new Error('xx type: ' + result.type);
    }
  }
  console.log({type:result.type,total, values});
  return total;
}

function part2() {

  let bits = '';
  for (var c of data) {
    let d = h2b[c];
    bits += d;
  }

  // let rootPacket = { type: null, version: null, packets: [] };
  // let rootPacket = { packets: [] };
  // let window = { bits, offset: 0 };
  let structure = parseBits(bits);

  //   while (result.input.trim() !== '' && result.input.match(/^0+$/) === null) {
  //   }

  // console.log('---');
  console.log(JSON.stringify(structure.result, null, 2));
  // console.log(structure);
  // console.log(crunchVersions(structure.result[0]));
  console.log(crunchPackets(structure.result[0]));

  return;
}

part2();
