
// |s0|s1|s2|
// |s7|xy|s3|
// |s6|s5|s4|
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
const ORTH_PARAMS = {
    right: { a: 0, b: 1, c: 6, d: 5, e: 3, v: 0, h: 1 },
    left: { a: 2, b: 1, c: 4, d: 5, e: 7, v: 0, h: -1 },
    up: { a: 6, b: 7, c: 4, d: 3, e: 1, v: -1, h: 0 },
    down: { a: 0, b: 7, c: 2, d: 3, e: 5, v: 1, h: 0 }
};

// |P|1|2|     | | | |
// |7|n|3| --> | | |a|   v(vertical multiplier)  h(horizontal multiplier)
// |6|5|4|     | |c|b|
const DIAG_PARAMS = {
    rightDown: { a: 3, b: 4, c: 5, v: 1, h: 1 },
    leftDown: { a: 5, b: 6, c: 7, v: 1, h: -1 },
    rightUp: { a: 1, b: 2, c: 3, v: -1, h: 1 },
    leftUp: { a: 7, b: 0, c: 1, v: -1, h: -1 }
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

function getFlag(flag, n) {
    return (flag & (1 << n)) != 0;
}

function diagonalScan(map, grid, x0, y0, params) {
    const p = params;
    let s = getSignature(map, x0, y0);
    let count = 0;
    if (s[p.a] || s[p.b] || s[p.c]) return 0;

    while (true) {
        count++;
        s = getSignature(map, x0 + p.h * count, y0 + p.v * count);
        if (s[p.a] || s[p.b] || s[p.c]) return 0;

        let jFlag = grid[y0 + count][x0 + count].jFlag;
        if (getFlag(jFlag, p.a) || getFlag(jFlag, p.c)) return count;
    }
}

function getOrthogonalDistances(map, x0, y0) {
    // |0|u|2|
    // |l| |r|
    // |6|d|4|

    const up = orthogonalScan(map, x0, y0, ORTH_PARAMS.up);
    const down = orthogonalScan(map, x0, y0, ORTH_PARAMS.down);
    const left = orthogonalScan(map, x0, y0, ORTH_PARAMS.left);
    const right = orthogonalScan(map, x0, y0, ORTH_PARAMS.right);

    return [0, up, 0, right, 0, down, 0, left];
}

function setDiagonalDistances(grid, map, x0, y0) {
    grid[y0][x0].jps[0] = diagonalScan(map, grid, x0, y0, DIAG_PARAMS.leftUp);
    grid[y0][x0].jps[2] = diagonalScan(map, grid, x0, y0, DIAG_PARAMS.rightUp);
    grid[y0][x0].jps[4] = diagonalScan(map, grid, x0, y0, DIAG_PARAMS.rightDown);
    grid[y0][x0].jps[6] = diagonalScan(map, grid, x0, y0, DIAG_PARAMS.leftDown);
}