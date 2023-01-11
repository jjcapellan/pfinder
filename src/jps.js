
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

function setBit(node, bit) {
    node.jFlag |= (1 << bit);
}

function orthogonalScan(map, x0, y0, params) {
    const p = params;
    let s = getSignature(map, x0, y0);
    let count = 0;
    if (s[p.e]) return { dst: 0, isJump: false };

    while (true) {
        count++;
        s = getSignature(map, x0 + p.h * count, y0 + p.v * count);
        if ((s[p.a] && !s[p.b]) || (s[p.c] && !s[p.d])) return { dst: count, isJump: true };
        if (s[p.e]) return { dst: count, isJump: false };
    }
}

function diagonalScan(map, grid, x0, y0, params) {
    const p = params;
    let s = getSignature(map, x0, y0);
    let count = 0;
    if (s[p.a] || s[p.b] || s[p.c]) return { dst: 0, isJump: false };

    while (true) {
        count++;
        s = getSignature(map, x0 + p.h * count, y0 + p.v * count);
        const isJump = grid[y0 + p.v * count][x0 + p.h * count].jump;
        if (x0 == 0 && y0 == 0) console.log(s);
        if ((s[p.a] || s[p.b] || s[p.c]) && !isJump) return { dst: count, isJump: false };


        const distances = grid[y0 + p.v * count][x0 + p.h * count].distances;
        if (isJump && (distances[p.a] || distances[p.c])) return { dst: count, isJump: true };
    }
}

function setOrthogonalDistances(grid, map, x0, y0) {
    const n = grid[y0][x0];
    // |0|u|2|
    // |l|n|r|
    // |6|d|4|
    const u = orthogonalScan(map, x0, y0, ORTH_PARAMS.up);
    const d = orthogonalScan(map, x0, y0, ORTH_PARAMS.down);
    const l = orthogonalScan(map, x0, y0, ORTH_PARAMS.left);
    const r = orthogonalScan(map, x0, y0, ORTH_PARAMS.right);
    // distances
    n.distances[1] = u.dst;
    n.distances[3] = r.dst;
    n.distances[5] = d.dst;
    n.distances[7] = l.dst;
    // flag
    if (u.isJump) setBit(n, 1);
    if (r.isJump) setBit(n, 3);
    if (d.isJump) setBit(n, 5);
    if (l.isJump) setBit(n, 7);
}

function setDiagonalDistances(grid, map, x0, y0) {
    const n = grid[y0][x0];
    // |lu|1|ru|
    // |7 | |3 |
    // |ld|5|rd|
    const lu = diagonalScan(map, grid, x0, y0, DIAG_PARAMS.leftUp);
    const ru = diagonalScan(map, grid, x0, y0, DIAG_PARAMS.rightUp);
    const rd = diagonalScan(map, grid, x0, y0, DIAG_PARAMS.rightDown);
    const ld = diagonalScan(map, grid, x0, y0, DIAG_PARAMS.leftDown);
    n.distances[0] = lu.dst;
    n.distances[2] = ru.dst;
    n.distances[4] = rd.dst;
    n.distances[6] = ld.dst;
    if (lu.isJump) setBit(n, 0);
    if (ru.isJump) setBit(n, 2);
    if (rd.isJump) setBit(n, 4);
    if (ld.isJump) setBit(n, 6);
}

export { setOrthogonalDistances, setDiagonalDistances };