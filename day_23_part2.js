let all_timer = process.hrtime();

var elapsed_time = function (hrtime) {
  var us_elapsed = process.hrtime(hrtime)[0] * 1000000 + process.hrtime(hrtime)[1] / 1000;
  return us_elapsed;
}

let debugMode = false;
let bigBoard = true;

// let sample = `#############
// #...........#
// ###B#C#B#D###
//   #A#D#C#A#
//   #########
// `;

let sample = `#############
#...........#
###B#C#B#D###
  #D#C#B#A#
  #D#B#A#C#
  #A#D#C#A#
  #########
`;

// sample = `#############
// #.....D.....#
// ###B#.#C#D###
//   #A#B#C#A#
//   #########
// `;

// sample = `#############
// #.....D....D#
// ###A#B#C#.###
//   #A#B#C#.#
//   #########
// `;

// sample = `#############
// #AA.....B.BD#
// ###B#.#.#.###
//   #D#.#C#.#
//   #D#B#C#C#
//   #A#D#C#A#
//   #########
// `;

const fs = require('fs');
let input;
if (process.argv[2] === "sample") {
  input = sample;
} else {
  let day = process.argv[2] ? process.argv[2] : '23p2';
  let filename = `input/day_${day}.txt`;
  input = fs
    .readFileSync(filename)
    .toString();
}

let data = input
  .split(/\r?\n/)
  .filter(e => e.trim() !== '')
  .map(e => e.split(''))
  ;

let xxx = `

 ╔═══════════════════════════╗
 ║ 0 1  2 3  4 5  6 7  8 9 10║
 ╚═══╗ 11 ║ 12 ║ 13 ║ 14 ╔═══╝
     ║ 15 ║ 16 ║ 17 ║ 18 ║  
     ╚════╩════╩════╩════╝  
       A    B    C    D
`;
const pieces = bigBoard ? {
  'A': {
    home: ['11', '15', '19', '23'],
    mult: 1,
  },
  'B': {
    home: ['12', '16', '20', '24'],
    mult: 10,
  },
  'C': {
    home: ['13', '17', '21', '25'],
    mult: 100,
  },
  'D': {
    home: ['14', '18', '22', '26'],
    mult: 1000,
  },
} : {
  'A': {
    home: ['11', '15'],
    mult: 1,
  },
  'B': {
    home: ['12', '16'],
    mult: 10,
  },
  'C': {
    home: ['13', '17'],
    mult: 100,
  },
  'D': {
    home: ['14', '18'],
    mult: 1000,
  },
};

function isHome(pieceId, posIndex) {
  return pieces[pieceId].home.includes(posIndex);
}

function movesNotOccupied(occupied) {
  return function (move) {
    return move.check.every(spot => !occupied.includes(spot)) &&
      !occupied.includes(move.to);
  }
}

function movesWithValidHomeMoves(board) {
  return function (move) {
    // return true;
    if (move.to * 1 <= 10) return true;
    let pKey = board[move.from * 1][0]; // eg A
    let p = pieces[pKey]; //  eg { home: [], mult: 1 }
    if (!p.home.includes(move.to)) return false;
    return true;
  }
}

function dontMoveIfAllHome(board) {
  return function (move) {
    // if (move.to*1<=10) return true;
    // let pKey = board[move.from*1][0];
    // // l(board[homeMap[move.from]*1]);
    // let other = board[homeMap[move.from]*1][0];
    // let isHome = pieces[pKey].home.includes(move.from);
    // if (isHome && other === '.') return false;
    // if (isHome && other === pKey) return false;
    return true;
  }
}

function thatsNotYourHome(board) {
  return function (move) {
    if (move.to * 1 <= 10) return true;
    let pKey = board[move.from * 1][0];
    let isHome = pieces[pKey].home.includes(move.to);
    return isHome;
  }
}

function notTooManyMoves(board, moveCount) {
  return function (move) {
    let pKey = board[move.from * 1];
    if (moveCount[pKey] && moveCount[pKey] > 4) return false;
    return true;
  }
}

const moveLimit = 2;

function superFilter(board, occupied, moveCount) {
  return function (move) {
    // if (debugMode && (move.from === '20' && move.to === '5')) {
    //   console.log('break')
    // }
    let pieceKey2 = board[move.from * 1];
    let pieceKey = pieceKey2[0];

    // too many moves
    if (moveCount[pieceKey2] && moveCount[pieceKey2] > moveLimit) return false;

    // not your home
    if ((move.to * 1 > 10) && !pieces[pieceKey].home.includes(move.to)) return false;

    // spot is occupied
    if (
      move.check.some(spot => occupied.includes(spot)) ||
      occupied.includes(move.to)
    ) return false;

    // dont move if home and not blocking
    // if (move.from*1>14 && pieces[pieceKey].home.includes(move.from)) return false;

    let hid = pieces[pieceKey].home[0];
    let home = bigBoard ? [board[hid * 1][0], board[hid * 1 + 4][0], board[hid * 1 + 8][0], board[hid * 1 + 12][0]].join('')
    : [board[hid * 1][0], board[hid * 1 + 4][0]].join('');
    let pattern = bigBoard ? pieceKey.repeat(4) : pieceKey.repeat(2);
    if (move.to * 1 >= 23) {
      pattern = '....';
    } else if (move.to * 1 >= 19) {
      pattern = '...' + pieceKey;
    } else if (move.to * 1 >= 15) {
      pattern = bigBoard ? '..' + pieceKey.repeat(2) : '..';
    } else if (move.to * 1 >= 11) {
      pattern = bigBoard ? '.' + pieceKey.repeat(3) : '.' + pieceKey;
    }
    let homeInviting = pattern === home;
    let homeFriendly = ('....' + pieceKey.repeat(4)).match(home);
    // if (pattern[0]==='.' && !homeFriendly) l(2,{home, pattern, homeFriendly});

    // if (true) {

    // dont move if home and with matching
    if (pieces[pieceKey].home.includes(move.from) && homeFriendly) return false;

    // dont move if home not friendly
    if (move.to * 1 > 10 && !homeInviting) return false;

    // } else {

    // // dont move if home and with matching
    // if (
    //   move.from*1>10 && 
    //   move.from*1<=14 && 
    //   pieces[pieceKey].home.includes(move.from) && 
    //   board[move.from*1+4][0] === pieceKey
    // ) return false;

    // // dont move if cohabiting with another thing
    // if (
    //   move.to*1>10 && 
    //   move.to*1<=14 && 
    //   board[move.to*1+4][0] !== pieceKey
    // ) return false;

    // }
    return true;

  }
}

function homeMovesOnly(board) {
  return function(move) {
    let pieceKey = board[move.from*1][0];
    let homes = pieces[pieceKey].home;
    return homes.includes(move.to);
  }
}

function reduceMovesMore(board, homeFilter) {
  return function(move) {

    // l(homeFilter.includes(move.from))
    return !homeFilter.includes(move.from);
    // let pieceKey2 = board[move.from*1];
    // let pieceKey2 = board[move.from*1];
  }
}

function nextSteps(board, map, moveCount, level) {
  let next = [];
  let occupied = [];
  for (let i in board) {
    let p = board[i][0];
    if (p !== '.') {
      let n = map[i].next;
      next.push(...n);
      occupied.push(i);
    }
  }
  // next = next.filter( e => e.from === '12' );
  // next = next.filter( e => e.to === '13' );
  // // dont need this next line? I must have accounted for it in the map build...
  // // next = next.filter( e => (e.to*1>10) || (e.to*1<=10 && e.from*1>10) );
  // remove moves with occupied paths
  // next = next.filter( movesNotOccupied(occupied) );
  // next = next.filter( movesWithValidHomeMoves(board) );
  // next = next.filter( dontMoveIfAllHome(board) );
  // next = next.filter( thatsNotYourHome(board) );
  // next = next.filter( notTooManyMoves(board, moveCount) );

  next = next.filter(superFilter(board, occupied, moveCount));
  let homeMoves = next.filter( homeMovesOnly(board) );
  let homeFilter = homeMoves.map(e=>e.from);
  next = next.filter( reduceMovesMore(board, homeFilter) );
  next = [...next, ...homeMoves]
  if (level <= 1) {
    // next = next.filter( e => (e.to==='0' || e.to==='10') );
  }

  // l(next);
  // l(next.length);
  // l(occupied);
  // [].
  return next;
}

// function filterNext(pieceId, currentIndex) {
//   return function(nextIndex) {
//     return (pieceData[pieceId].home.includes(nextIndex) && (pieceData[pieceId].home[1])) || // always allowed home unless occupied
//            (nextIndex > 10 && nextIndex == currentIndex - 4) || // allow for exiting room

//   }
// }

function readInputMap(board, map, xyToKey) {
  let index = 0;
  let pieceCount = {
    'A': 0,
    'B': 0,
    'C': 0,
    'D': 0,
  };
  for (let r in data) {
    r = r * 1;
    for (let c in data[r]) {
      c = c * 1;
      let s = data[r][c];
      if (s !== '#' && s !== ' ') {
        let k = true;
        if (r === 1 && (c === 3 || c === 5 || c === 7 || c === 9)) {
          k = false;
        }
        let x = c - 1;
        let y = r - 1;
        let key = [x, y].toString();
        let spot = {
          index,
          key,
          x,
          y,
          k,
          type: s,
        };
        if (s !== '.') {
          pieceCount[s]++;
          let si = pieceCount[s]
          board[index] = s + si;
          // board.push(Object.assign({type: s}, JSON.parse(JSON.stringify(spot))));
        }
        xyToKey[key] = index.toString();
        map[index] = spot;
        index++;
      }
    }
  }
}

function extendMap(map, xyToKey) {
  for (let nodeStartKey in map) {
    let nodeStart = map[nodeStartKey];
    if (nodeStart.k === false) continue;
    nodeStart.next = [];
    if (nodeStart.k) {
      for (let nodeEndKey in map) {
        let nodeEnd = map[nodeEndKey];
        if (nodeEnd.k === false) continue;
        if (nodeStart.y === 0 && nodeEnd.y === 0) continue;
        let check = [];
        let d = 1;
        if (nodeStart.y >= 2) {
          for (iy = nodeStart.y - 1; iy >= 1; iy--) {
            let n = xyToKey[[nodeStart.x, iy]];
            if (n) {
              check.push(n);
              d++;
            }
          }
        }
        for (let xx = Math.min(nodeStart.x, nodeEnd.x); xx <= Math.max(nodeStart.x, nodeEnd.x); xx++) {
          let n = xyToKey[[xx, 0]];
          // if (n) {
          if (n && n !== nodeStartKey && n !== nodeEndKey) {
            check.push(n);
            d++;
          }
        }
        if (nodeEnd.y >= 2) {
          for (iy = nodeEnd.y - 1; iy >= 1; iy--) {
            let n = xyToKey[[nodeEnd.x, iy]];
            if (n) {
              check.push(n);
              d++;
            }
          }
        }
        // let xd = node.x < node2.x ? 1 : -1;
        // let yd = node.y < node2.y ? 1 : -1;
        // if (nodeStart.y == 2) {
        //   let n = xyToKey[[nodeStart.x, 1]];
        //   if (n) {
        //     check.push(n);
        //   }
        // }
        // for (let xx = Math.min(nodeStart.x, nodeEnd.x); xx <= Math.max(nodeStart.x, nodeEnd.x); xx++) {
        //   for (let yy = Math.min(nodeStart.y, nodeEnd.y); yy <= Math.max(nodeStart.y, nodeEnd.y); yy++) {
        //     let n = xyToKey[[xx, yy]];
        //     if (n) {
        //     // if (n && xx !== nodeStart.x && nodeStart.y !== nodeEnd.y) {
        //       check.push(n);
        //     }
        //   }
        // }
        // if (nodeEnd.y == 2) {
        //   let n = xyToKey[[nodeEnd.x, 1]];
        //   if (n) {
        //     check.push(n);
        //   }
        // }
        // check.push(nodeEndKey);
        if (nodeEnd.k && !(nodeStart.x === nodeEnd.x && nodeStart.y === nodeEnd.y)) {
          nodeStart.next.push({
            from: nodeStartKey,
            to: nodeEndKey,
            // s: [nodeStart.x, nodeStart.y, nodeEnd.x, nodeEnd.y],
            dist: d,//Math.abs(nodeStart.x - nodeEnd.x) + Math.abs(nodeStart.y - nodeEnd.y),
            check,
          });
        }
      }
    }
  }
}

function Node(score, piece, to, from) {
  score = typeof score !== 'undefined' ? score : 999;
  next = typeof next !== 'undefined' ? next : null;
  piece = typeof piece !== 'undefined' ? piece : -1;
  to = typeof to !== 'undefined' ? to : -1;
  from = typeof from !== 'undefined' ? from : -1;
  return {
    next,
    score,
    piece,
    to,
    from,
  };
}

function OrderedList() {
  let head = null;
  let tail = null;
  return {
    insertNew: function (score, piece, to, from) {
      let node = new Node(score, piece, to, from);
      return this.insertNode(node);
    },
    insertNode: function (node) {
      if (head === null) {
        head = node;
        tail = node;
        return head;
      }

      let current = head;
      while (current.score < node.score) {
        if (current.next === null) break;
        current = current.next;
      }
      node.next = current.next;
      current.next = node;
      tail = node;
      return current;
    },
    pop: function () {
      let temp = head;
      head = head.next;
      return temp;
    },
    getHead: function () {
      return head;
    }
  }
}

function gameEnd(board, solution) {
  let end = true;
  for (let key in pieces) {
    let piece = pieces[key];
    end = end && piece.home.every(e => board[e][0] === key);
  }
  // if (end) {
  //   printBoard(board);
  //   console.log(solution);
  // }
  return end;
}

let bestScore = null;

function recursiveSolve(board, map, solution, solutions, moveCount, score) {
  if (bestScore !== null && score > bestScore) return;
  // if (solution.length > 20) return;
  // if (solution.length == 2) {
  //   printBoard(board);
  //   l(solution)
  // }
  if (gameEnd(board, solution)) {
    // l('YEY!');
    bestScore = score;
    if (debugMode) {
      console.log(bestScore);
      console.log(solution);
      printBoard(board);
    }
    solutions.push(solution);
    return solutions;
  }
  let next = nextSteps(board, map, moveCount, solution.length);
  if (next.length === 0) {
    // l('BOO!');
    return solutions;
  }
  // if (debugMode) {
  //   l('\nnext:');
  //   l(next);
  // }
  for (let step of next) {
    // if (solution.length === 0 && !(step.from === '11')) continue;
    // if (solution.length === 1 && !(step.from === '13')) continue;
    // if (solution.length === 0 && !(step.from === '11' && step.to === '10')) continue;
    // if (solution.length === 1 && !(step.from === '18' && step.to === '0')) continue;
    // if (solution.length === 2 && !(step.from === '13' && step.to === '9')) continue;
    let newBoard = Array.from(board);
    let newSolution = Array.from(solution);
    let newMoveCount = JSON.parse(JSON.stringify(moveCount));
    let piece = board[step.from * 1];
    let mult = pieces[piece[0]].mult;
    // if (solution.length === 0 && step.from !== '12') continue;
    newSolution.push({
      piece,
      from: step.from,
      to: step.to,
      score: step.dist * mult,
    });
    newBoard[step.to * 1] = newBoard[step.from * 1];
    newBoard[step.from * 1] = '.';
    if (newMoveCount[piece]) {
      newMoveCount[piece]++;
    } else {
      newMoveCount[piece] = 1;
    }
    // l({newSolution, solutions});
    let newSolutions = recursiveSolve(newBoard, map, newSolution, solutions, newMoveCount, score + (step.dist * mult));
    // if (newSolutions.length > 0) {
    //   solutions.push(...newSolutions);
    // }
  }

  return solutions;

}

function solver() {
  let map = {};
  let xyToKey = {};
  let board = bigBoard ? 
    Array.from({ length: 27 }, (v, k) => '.') : 
    Array.from({ length: 19 }, (v, k) => '.');
  let result = 0;

  readInputMap(board, map, xyToKey);
  extendMap(map, xyToKey);

  //   printBoard(board);
  //   return;
  let solutions = recursiveSolve(board, map, [], [], {}, 0);
  let m = solutions[0];
  for (let s of solutions) {
    if (s.reduce((p, v) => p + v.score, 0) < m.reduce((p, v) => p + v.score, 0)) {
      m = s;
    }
  }

  console.log(m);
  console.log({ score: m.reduce((p, v) => p + v.score, 0) });
  console.log({ length: solutions.length });

  return result;
}

function printBoard(board) {
  let b = board.map(e => e.padStart(2, '.'));
  // b = b.map((e,i)=>e!=='..'?e:i.toString().padStart(2,'0'));
  let l = `
  ################################################
  ##                                            ##
  ## ${b[0]}  ${b[1]}  ${b[2]}  ${b[3]}  ${b[4]}  ${b[5]}  ${b[6]}  ${b[7]}  ${b[8]}  ${b[9]}  ${b[10]} ##
  ##                                            ##
  #########  ${b[11]}  ##  ${b[12]}  ##  ${b[13]}  ##  ${b[14]}  #########
         ##      ##      ##      ##      ##
         ##  ${b[15]}  ##  ${b[16]}  ##  ${b[17]}  ##  ${b[18]}  ##  
         ##      ##      ##      ##      ##
         ##  ${b[19]}  ##  ${b[20]}  ##  ${b[21]}  ##  ${b[22]}  ##  
         ##      ##      ##      ##      ##
         ##  ${b[23]}  ##  ${b[24]}  ##  ${b[25]}  ##  ${b[26]}  ##  
         ##      ##      ##      ##      ##
         ##################################
`;
  console.log(l);
}

solver();

console.log(`overall time: ${(elapsed_time(all_timer)/1000).toFixed(1)}ms`)