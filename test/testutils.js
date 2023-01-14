import fs from 'node:fs';

function genMapArray(width, height) {
    const map = [];

    for (let y = 0; y < height; y++) {
        let row = new Array(width).fill(0);
        row.forEach((_, x) => {
            row[x] = Math.random() > 0.7 ? 1 : 0;
        });
        map.push(row);
    }
    return map;
}

function genMapFile(width, height, fileName, isJSON) {
    const mapName = `map${width}x${height}`;
    const map = genMapArray(width, height);

    if (isJSON) {
        fs.writeFileSync(fileName, JSON.stringify(map));
    } else {
        fs.writeFileSync(fileName, `const ${mapName}=${JSON.stringify(map)};\nexport { ${mapName} };`);
    }
}

function getMapFromFile(fileName) {
    const map = fs.readFileSync(fileName);
    const array = JSON.parse(map);
    return array;
}

function genqueriesArray(n, width, height) {
    let counter = 0;
    const queries = [];
    while (counter < n) {
        let x0 = Math.round(Math.random() * (width - 1));
        let y0 = Math.round(Math.random() * (height - 1));
        let x1 = Math.round(Math.random() * (width - 1));
        let y1 = Math.round(Math.random() * (height - 1));
        if (x0 == x1 && y0 == y1) continue;
        counter++;
        queries.push([x0, y0, x1, y1]);
    }
    return queries;
}

function genQueriesFile(n, width, height, fileName) {
    const name = `queries${width}x${height}`;
    const queries = genqueriesArray(n, width, height);

    const file = fs.createWriteStream(fileName);
    file.on('error', err => console.log(err));
    file.write(`const ${name}=`);
    file.write(JSON.stringify(queries) + ';');
    file.write(`\nexport { ${name} };`);
    file.end();
}

function printState(grid, active) {
    let width = grid[0].length;
    let height = grid.length;
    let header = '   ';

    console.log('Active node: ' + active.x + ' ' + active.y + '\n');
    for (let x = 0; x < width; x++) {
        x = x.toString().padEnd(2, ' ');
        header += '|' + x;
    }
    console.log(header);
    for (let y = 0; y < height; y++) {
        let row = grid[y];
        let str = '';
        row.forEach(n => {
            if (n) {
                if (n.inOpen) {
                    str += '|o ';
                }
                else
                    if (n.inClose) {
                        str += '|c ';
                    }
                    else {
                        str += '|  ';
                    }
            }

            if (!n) str += '|X ';
        });
        str += '|';
        let rowStart = y.toString();
        rowStart = rowStart.padEnd(3, ' ');
        console.log(rowStart + str);
    }
}

function printGrid(grid, x0, y0, x1, y1) {
    for (let y = y0; y <= y1; y++) {
        let row = grid[y];
        const selection = [];
        for (let x = x0; x <= x1; x++) {
            let value = 0;
            if (!row[x]) value = 1;
            selection.push(value);
        }
        console.log(selection.toString());
    }
    console.log('\n');
}

export {
    genMapArray,
    genMapFile,
    genqueriesArray,
    genQueriesFile,
    getMapFromFile,
    printGrid,
    printState,
};