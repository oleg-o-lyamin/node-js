#!/usr/bin/env node

const fs = require('fs')
const yargs = require('yargs')
const path = require('path')
const inquirer = require('inquirer')

const options = yargs.usage("Usage: [-p <path>]").option("p", { alias: "path", describe: "Path to folder. If undefined, current is used.", type: "string", demandOption: false }).argv;

const ips = ['89.123.1.41', '34.48.240.111'];

let currentFolder = (options.path) ? options.path : process.cwd();

let prompt = (folder) => {
    let isFile = filename => { return fs.lstatSync(folder + "\\" + filename).isFile(); }

    let list = fs.readdirSync(folder);
    let listOfFiles = list.filter(isFile);
    let listOfFolders = ["..", ...list.filter((filename) => !isFile(filename))];
    let finalList = [...listOfFolders, ...listOfFiles];

    inquirer.prompt([{
        name: "filename",
        type: "list",
        message: "Choose a folder or a file:",
        choices: finalList,
    }]).then((answer) => {
        if (listOfFolders.includes(answer.filename)) {
            console.log(`Moving to folder ${answer.filename}`);
            prompt(path.join(folder, answer.filename));
        } else {
            console.log(`You chose file ${answer.filename}`);

            const lineReader = require('readline').createInterface({
                input: fs.createReadStream(path.join(folder, answer.filename))
            });

            lineReader.on('line', function (line) {
                for (let i = 0; i < ips.length; i++) {
                    let regex = new RegExp(`^${ips[i]}`);
                    if (line.match(regex) != null) {
                        console.log(line);
                        break;
                    }
                }
            });

            lineReader.on('close', () => {
                console.log("DONE!");
            });
        }
    });
}

prompt(currentFolder);

