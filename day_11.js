let sample = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526
`;

let size = 10;

let adjacents = [-size - 1, -size, -size + 1, -1, 1, size - 1, size, size + 1];

function adjMap(p) {
    let result;
    let l = p % size === 0;
    let r = p % size === (size - 1);
    let t = p < size;
    let b = p >= (size * size - size);
    if (p === 0) {
        result = [1, size, size + 1];
    } else if (p === 9) {
        result = [-1, size - 1, size];
    } else if (p === 90) {
        result = [-size, -size + 1, 1];
    } else if (p === 99) {
        result = [-size - 1, -size, -1];
    } else if (t) {
        result = [-1, 1, size - 1, size, size + 1];
    } else if (l) {
        result = [-size, -size + 1, 1, size, size + 1];
    } else if (b) {
        result = [-size - 1, -size, -size + 1, -1, 1];
    } else if (r) {
        result = [-size - 1, -size, -1, size - 1, size];
    } else {
        result = [-size - 1, -size, -size + 1, -1, 1, size - 1, size, size + 1];
    }
    return result;
}

function xyToLinear(x, y) {
    return x + (y * size);
}

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

let data;
let limit;
function loadData() {
    limit = 1000;
    data = input
        .replace(/\r?\n?/gi, '')
        .split('')
        .map(n => parseInt(n))
    ;
}

let all = Array.from({ length: size * size }, (v, i) => i);

function getAdjacents(p) {
    let a = adjMap(p);
    let result = a.map(e => e + p);
    return result;
}

function getNeighbours(x, y) {
    x = parseInt(x);
    y = parseInt(y);
    let p = xyToLinear(x, y);
    for (let a of adjacents) {
        let d = data[p + a];
        if (typeof d !== 'undefined') {
            console.log(d);
        }
    }
}

function incNeighbours(x, y) {
    x = parseInt(x);
    y = parseInt(y);
    let p = xyToLinear(x, y);
    for (let a of adjacents) {
        let d = data[p + a];
        if (typeof d !== 'undefined') {
            data[p + a] += 1;
        }
    }
}

function printGrid() {
    let grid = [];
    for (let i = 0; i < size; i++) {
        grid.push(data.slice((i * size), (i * size) + size));
    }
    console.table(grid);
}

function incList(list) {
    limit--;
    if (limit <= 0) throw new Error('iter oops');
    let flash = [];
    for (let i of list) {
        if (typeof data[i] !== 'undefined') {
            data[i]++;
            if (data[i] === 10) {
                flash.push(i);
            }
            if (data[i] > 1000) throw new Error('max oops');
        }
    }
    let check = [];
    flash.forEach(e => {
        check.push(...getAdjacents(e));
    });
    if (check.length > 0) {
        incList(check);
    }
}

function resetAll() {
    let count = 0;
    for (let i of all) {
        if (data[i] > 9) {
            count++;
            data[i] = 0;
        }
    }
    return count;
}

function resetAll2() {
    let count = 0;
    let zeros = 0;
    for (let i of all) {
        if (data[i] > 9) {
            count++;
            data[i] = 0;
        }
        if (data[i] === 0) {
            zeros++;
        }
    }
    return { count, zeros };
}

function part1() {
    loadData();
    let loop = 100;
    let flashes = 0;
    for (let i = 0; i < loop; i++) {
        incList(all);
        flashes += resetAll();
    }
    // printGrid();
    return flashes;
}

function part2() {
    loadData();
    let loop = 10000;
    let check;
    let i;
    let lims = [];
    for (i = 0; i < loop; i++) {
        incList(all);
        check = resetAll2();
        lims.push(1000-limit);
        limit = 1000;
        if (check.zeros==(size*size)) break;
    }
    // printGrid();
    // console.log(lims.sort((a,b)=>b-a));
    return i+1;
}

console.log(`part 1: ${part1()}`);
console.log(`part 2: ${part2()}`);
