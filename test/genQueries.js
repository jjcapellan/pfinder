import fs from 'node:fs';

const args = process.argv.slice(2);
const n = parseInt(args[0]);
const width = parseInt(args[1]);
const height = parseInt(args[2]);
const fileName = args[3];

function genQueries(n, width, height, fileName) {
    const name = `queries${width}x${height}`;

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

    const file = fs.createWriteStream(fileName);
    file.on('error', err => console.log(err));
    file.write(`const ${name}=`);
    file.write(JSON.stringify(queries) + ';');
    file.write(`\nexport { ${name} };`);
    file.end();
}

genQueries(n, width, height, fileName);