// Silly code golf attempt
let input = require('fs').readFileSync('input/day_13.txt').toString();
let z = (a, b) => b - a;
let c = (i, d) => d - Math.abs(d - i % (d * 2 + 2));
let a = (x, y) => Array.from({ length: y }, () => Array.from({ length: x }, () => ' '));
// let g = (t, u) => { let r = a(u[0], u[1]); t.map(e => [c(e[0], u[0]), c(e[1], u[1])]).filter(e => e[0] > -1 && e[1] > -1).forEach(e => r[e[1]][e[0]] = '#'); return r };
let g = (t, u) => t.map(e => [c(e[0], u[0]), c(e[1], u[1])]).filter(e => e[0] > -1 && e[1] > -1).reduce((p,e) => {p[e[1]][e[0]] = '#'; return p}, a(u[0], u[1]) );
let d = input.split(/\n\n/).map(e => e.split(/\n/).filter(e => e != ''));
let [p, q] = [d[0].map(e => e.split(",").map(e => e * 1)), d[1].map(e => e.split(' ')[2])];
let x = (d[1][0].split(' ')[2][0] === 'x') ? [2, 1] : [1, 2];
let n = [p.map(e => e[0]).sort(z)[0], p.map(e => e[1]).sort(z)[0]].map((e, i) => (e + e % 2) / (x[i]));
let m = [q.filter(e => e[0] === 'x').slice(-1)[0].substring(2) * 1, q.filter(e => e[0] === 'y').slice(-1)[0].substring(2) * 1];
console.log('Part 1: ' + g(p, n).reduce((p, v) => p + v.reduce((p, v) => p + (v === '#'), 0), 0));
console.log('Part 2: ' + '\n\n' + g(p, m).map(e => e.join('')).join('\n') + '\n');
