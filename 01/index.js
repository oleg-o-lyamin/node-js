const process = require('process');
const colors = require('colors');

let l = 2, r = -1;

let printUsage = function () {
    console.log("USAGE: node index.js [lower_boundary] upper_boundary.");
    console.log("lower_boundary <= upper boundary must be integers.");
}

switch (process.argv.length) {
    case 3:
        r = parseInt(process.argv[2]);
        break;
    case 4:
        l = parseInt(process.argv[2]);
        r = parseInt(process.argv[3]);
        break;
    default:
        printUsage();
        process.exit(1);
}

if (l == undefined || r == undefined) {
    printUsage();
    process.exit(1);
}

const color_functions = [colors.red, colors.yellow, colors.green];

let composites = new Array(r + 1);
for (let i = 2; i <= Math.sqrt(r); i++)
    if (!composites[i])
        for (let j = i * i; j <= r; j += i)
            composites[j] = true;

for (let n = l, index = 0; n <= r; n++)
    if (!composites[n]) {
        console.log(color_functions[index](n));
        index = (index + 1) % 3;
    }


