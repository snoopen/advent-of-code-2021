let s0 = `start-A
start-b
A-c
A-b
b-d
A-end
b-end
`;

let s1 = `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc
`;

let s2 = `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW
`;

let c0 = `start,A,b,A,b,A,c,A,end
start,A,b,A,b,A,end
start,A,b,A,b,end
start,A,b,A,c,A,b,A,end
start,A,b,A,c,A,b,end
start,A,b,A,c,A,c,A,end
start,A,b,A,c,A,end
start,A,b,A,end
start,A,b,d,b,A,c,A,end
start,A,b,d,b,A,end
start,A,b,d,b,end
start,A,b,end
start,A,c,A,b,A,b,A,end
start,A,c,A,b,A,b,end
start,A,c,A,b,A,c,A,end
start,A,c,A,b,A,end
start,A,c,A,b,d,b,A,end
start,A,c,A,b,d,b,end
start,A,c,A,b,end
start,A,c,A,c,A,b,A,end
start,A,c,A,c,A,b,end
start,A,c,A,c,A,end
start,A,c,A,end
start,A,end
start,b,A,b,A,c,A,end
start,b,A,b,A,end
start,b,A,b,end
start,b,A,c,A,b,A,end
start,b,A,c,A,b,end
start,b,A,c,A,c,A,end
start,b,A,c,A,end
start,b,A,end
start,b,d,b,A,c,A,end
start,b,d,b,A,end
start,b,d,b,end
start,b,end
`;

let sample = s0;

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
    .filter(e => e !== '')
    .map(e => e.split(/-/))
;

function findNextStep(paths, map) {
    let newPaths = [];
    let extended = false;
    for (let path of paths) {
        let endName = path.slice(-1)[0];
        let endNode = map[endName];
        if (typeof endNode === 'undefined') {
            throw new Error(`toes`);
        }
        let nextNodes = endNode.next.filter(e => ((map[e].large === true) || (map[e].large === false && path.includes(e) === false)));
        if (nextNodes.length > 0 && endName !== 'end') {
            for (let node of nextNodes) {
                let newPath = Array.from(path);
                newPath.push(node);
                newPaths.push(newPath);
                extended = true;
            }
        } else {
            newPaths.push(Array.from(path));
        }
    }
    return { paths: newPaths, extended };
}

function part1() {
    let limit = 200;
    let map = {};
    let result = 0;
    for (var line of data) {
        let a = line[0];
        let aLarge = a.toUpperCase() === a;
        let b = line[1];
        let bLarge = b.toUpperCase() === b;
        if (typeof map[a] === 'undefined') {
            map[a] = {
                large: aLarge,
                next: [],
            };
        }
        if (typeof map[b] === 'undefined') {
            map[b] = {
                large: bLarge,
                next: [],
            };
        }
        map[a].next.push(b);
        map[b].next.push(a);
    }
    let paths = [
        ['start'],
    ];

    let searching = true;
    while (searching) {
        limit--;
        if (limit < 0) break;
        let option = findNextStep(paths, map);
        searching = option.extended;
        paths = option.paths;
    }
    paths = paths.filter(e => e.slice(-1)[0] === 'end');
    result = paths.length;
    return result;
}

// ##################################################################################
// ##                                    PART 2                                    ##
// ##################################################################################

function findNextStep2(options, map) {
    let newOptions = [];
    let extended = false;
    for (let option of options) {
        let endName = option.path.slice(-1)[0];
        let endNode = map[endName];
        let copy = Array.from(option.path);
        if (endName === 'end') {
            newOptions.push(option);
            continue;
        }
        let nextNodes = endNode.next.filter(e => e !== 'start');
        for (let nextNode of nextNodes) {
            let visits = option.path.filter(e => ((e === nextNode) && (map[e].large === false))).length;
            if (visits < option.revisit || map[nextNode].large === true) {
                extended = true;
                let revisit = option.revisit;
                if (visits > 0 && map[nextNode].large === false) revisit = 1; 
                let newOption = { revisit, path: Array.from(copy) };
                newOption.path.push(nextNode);
                newOptions.push(newOption);
            }
        }
    }
    return { options: newOptions, extended };
}

function part2() {
    let limit = 200;
    let map = {};
    let result = 0;
    for (var line of data) {
        let a = line[0];
        let aLarge = a.toUpperCase() === a;
        let b = line[1];
        let bLarge = b.toUpperCase() === b;
        if (typeof map[a] === 'undefined') {
            map[a] = {
                large: aLarge,
                next: [],
            };
        }
        if (typeof map[b] === 'undefined') {
            map[b] = {
                large: bLarge,
                next: [],
            };
        }
        map[a].next.push(b);
        map[b].next.push(a);
    }
    let options = [
        { revisit: 2, path: ['start'], }
    ];

    let searching = true;
    while (searching) {
        limit--;
        if (limit < 0) break;
        let result = findNextStep2(options, map);
        searching = result.extended;
        options = result.options;
    }
    options = options.filter(e => e.path.slice(-1)[0] === 'end');
    result = options.length;
    return result;
}

console.log(`part 1: ${part1()}`);
console.log(`part 2: ${part2()}`);
