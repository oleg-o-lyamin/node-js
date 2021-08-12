const http = require('http');
const fs = require('fs');

// начальная папка - расположение кода сервера
let folder = process.cwd();

http.createServer((request, response) => {
    const params = require('url').parse(request.url, true).query;

    let showFolders = true;

    // относительный путь передаётся через параметр запроса f
    // если он указывает на файл, то открывается файл
    // если на папку, то происходит переход
    if (params.f) {
        if (!fs.lstatSync(folder + "\\" + params.f).isFile()) {
            folder += ("\\" + params.f);
        }
        else {
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            fs.createReadStream(folder + "\\" + params.f).pipe(response);
            showFolders = false;
        }
    }

    if (showFolders) {
        let isFile = filename => { return fs.lstatSync(folder + "\\" + filename).isFile(); }

        let list = fs.readdirSync(folder);
        let listOfFiles = list.filter(isFile);
        let listOfFolders = ["..", ...list.filter((filename) => !isFile(filename))];
        let finalList = [...listOfFolders, ...listOfFiles];

        let data = "<div>";
        finalList.forEach((item) => { data += `<div><a href="/?f=${item}">${item}<a></div>`; });
        data += "</div>"

        response.setHeader('Content-Type', 'text/html');
        response.end(data);
    }

}).listen(3000, 'localhost');