function getSignature(map, x, y) {
    const width = map[0].length;
    const height = map.length;
    const topBound = y == 0,
        bottomBound = y == height - 1,
        leftBound = x == 0,
        rightBound = x == width - 1;

    let s0 = !(topBound || leftBound) ? map[y - 1][x - 1] : 1;
    let s1 = !(topBound) ? map[y - 1][x] : 1;
    let s2 = !(topBound || rightBound) ? map[y - 1][x + 1] : 1;
    let s3 = !(rightBound) ? map[y][x + 1] : 1;
    let s4 = !(bottomBound || rightBound) ? map[y + 1][x + 1] : 1;
    let s5 = !(bottomBound) ? map[y + 1][x] : 1;
    let s6 = !(bottomBound || leftBound) ? map[y + 1][x - 1] : 1;
    let s7 = !(leftBound) ? map[y][x - 1] : 1;

    return [s0, s1, s2, s3, s4, s5, s6, s7];
}

// |0|1|2|     |a|b| |
// |p|n|3| --> | | |e|   v(vertical multiplier)  h(horizontal multiplier)
// |6|5|4|     |c|d| |
const PARAMS = {
    right: { a: 0, b: 1, c: 6, d: 5, e: 3, v: 0, h: 1 },
    left: { a: 2, b: 1, c: 4, d: 5, e: 7, v: 0, h: -1 },
    up: { a: 6, b: 7, c: 4, d: 3, e: 1, v: -1, h: 0 },
    down: { a: 0, b: 7, c: 2, d: 3, e: 5, v: 1, h: 0 }
};

function orthogonalScan(map, x0, y0, params) {
    const p = params;
    let s = getSignature(map, x0, y0);
    let count = 0;
    if (s[p.e]) return 0;

    while (true) {
        count++;
        s = getSignature(map, x0 + p.h * count, y0 + p.v * count);
        if ((s[p.a] && !s[p.b]) || (s[p.c] && !s[p.d])) return count;
        if (s[p.e]) return 0;
    }
}

function getOrthogonalDistances(map, x0, y0) {
    // |0|u|2|
    // |l| |r|
    // |6|d|4|

    const up = orthogonalScan(map, x0, y0, PARAMS.up);
    const down = orthogonalScan(map, x0, y0, PARAMS.down);
    const left = orthogonalScan(map, x0, y0, PARAMS.left);
    const right = orthogonalScan(map, x0, y0, PARAMS.right);

    return [0, up, 0, right, 0, down, 0, left];
}