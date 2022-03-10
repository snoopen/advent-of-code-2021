let sample = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`;

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
;

let bingo_numbers = [];
let board_num_stack = [];
let board_chk_stack = [];
let board_nums = [];
let board_chks = [];
let segment = 0;
let row = 0;

let boardCount = board_chk_stack;
let winCount = 0;
let board_won_stack = [];

function generator() {
  row = 0;
  segment = 0;
  bingo_numbers = [];
  board_num_stack = [];
  board_chk_stack = [];
  for (var line of data) {
    if (line === '') {
      segment++;
      board_nums = [];
      board_chks = Array.from({length: 25}, ()=> false);
      row = 0;
    } else if (segment === 0) {
      bingo_numbers = line.trim().split(',').map(i=>Number(i));
    } else {
      let numbers = line.trim().split(/\s+/).map(i=>Number(i));
      board_nums.push(... numbers);
      row++;
      if (row === 5) board_num_stack.push(board_nums);
      if (row === 5) board_chk_stack.push(board_chks);
    }
  }
  boardCount = board_chk_stack.length;
  board_won_stack = Array.from({length: boardCount}, ()=> false);
}
function checkOff(num) {
  for (let board_index in board_num_stack) {
    for (let offset in board_num_stack[board_index]) {
      if (board_num_stack[board_index][offset] === num) {
        board_chk_stack[board_index][offset] = true;
      }
    }
  }
}

function rowMatch(board) {
  let result = false;
  for (let o = 0; o < board.length; o += 5) {
    result = board.slice(o, o + 5).every(v=>v===true);
    if (result) console.log({row:o});
    if (result) break;
  }
  return result;
}

function colMatch(board) {
  let result = false;
  let r = -1;
  let c = -1;
  for (r = 0; r < 5; r++) {
    let check = [];
    for (c = 0; c < board.length - 4; c += 5) {
      check.push(board[r+c]);
    }
    result = check.every(v=>v===true);
    if (result) console.log({colR:r});
    if (result) console.log({colC:c});
    if (result) break;
  }
  return result;
}

function anyMatch(board_index) {
  if (rowMatch(board_chk_stack[board_index])) return true;
  if (colMatch(board_chk_stack[board_index])) return true;
  return false;
}

function sumWin(board_index) {
  let nums = board_num_stack[board_index].filter((v,i)=>!board_chk_stack[board_index][i]);
  let sum = nums.reduce((p,v)=>p+v,0);
  return sum;
}

function part1() {
  generator();
  // let result = 0;
  let foundMatch = false;
  let bi = -1;
  let sum = 0;
  for (var num of bingo_numbers) {
    // console.log(num);
    checkOff(num);
    for (bi in board_chk_stack) {
      bi = Number(bi);
      if (anyMatch(bi)) foundMatch = true;
      if (foundMatch) break;
    }
    if (foundMatch) break;
  }
  if (foundMatch) {
    sum = sumWin(bi);
  }
  return sum * num;
}

function part2() {
  generator();
  let lastBoardMatch = false;
  let bi = -1;
  let sum = 0;
  for (var num of bingo_numbers) {
    checkOff(num);
    for (bi in board_chk_stack) {
      bi = Number(bi);
      if (board_won_stack[bi] === false && anyMatch(bi)) {
        winCount++;
        board_won_stack[bi] = true;
        if (winCount === boardCount) lastBoardMatch = true;
        if (lastBoardMatch) break;
      }
    }
    if (lastBoardMatch) break;
  }
  if (lastBoardMatch) {
    sum = sumWin(bi);
  }
  return sum * num;
}

console.log(`part 1: ${part1()}`);
console.log(`part 2: ${part2()}`);
