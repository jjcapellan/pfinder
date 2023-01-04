import fs from 'node:fs';

const args = process.argv.slice(2);
const width = parseInt(args[0]);
const height = parseInt(args[1]);
const fileName = args[2];
console.log(width, height, fileName);

function genMap(width, height, fileName) {
    const mapName = `map${width}x${height}`;
    const map = [];

    for (let y = 0; y < height; y++) {        
        let row = new Array(width).fill(0);
        row.forEach((_, x) => {
            row[x] = Math.random() > 0.7 ? 1 : 0;
        });
        map.push(row);
    }

    const file = fs.createWriteStream(fileName);    
    file.on('error', err => console.log(err) );
    file.write(`const ${mapName}=`);
    file.write(JSON.stringify(map)+';');
    file.write(`\nexport { ${mapName} };`);
    file.end();
}

genMap(width, height, fileName);

