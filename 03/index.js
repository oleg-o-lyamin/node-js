
const fs = require('fs');

const ips = ['89.123.1.41', '34.48.240.111'];

let logFile = (file) => { return file + ".log"; }

let writeStreams = new Array(ips.length);

ips.forEach((el, index) => {
    fs.unlink(logFile(el), () => { });
    writeStreams[index] = fs.createWriteStream(logFile(el), { flags: 'a' });
});

const lineReader = require('readline').createInterface({
    input: fs.createReadStream(logFile('access'))
});

lineReader.on('line', function (line) {
    for (let i = 0; i < ips.length; i++) {
        let regex = new RegExp(`^${ips[i]}`);
        if (line.match(regex) != null) {
            writeStreams[i].write(line + "\n");
            break;
        }
    }
});

lineReader.on('close', () => {
    console.log("DONE!");
    writeStreams.forEach(
        (stream) => {
            stream.end(() => { })
        }
    )
});

