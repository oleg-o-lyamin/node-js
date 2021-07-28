
const process = require('process');
const { EventEmitter } = require('events');
const emitter = new EventEmitter();

class Handler {
    static handle([str, stamp]) {
        let dif = Math.floor((stamp - Date.now()) / 1000);
        if (dif > 0) {
            let s = dif % 60;
            let m = Math.floor((dif - s) / 60) % 60;
            let h = Math.floor((Math.floor((dif - s) / 60) - m) / 60) % 24;
            let d = Math.floor((Math.floor((Math.floor((dif - s) / 60) - m) / 60) - h) / 24);
            console.log(`${d} days, ${h} hours, ${m} minutes, ${s} seconds until ${str}.`);
        }
        else
            console.log(`${str} is in the past.`)
    }
}

emitter.on('', Handler.handle);

class Timer {
    constructor(str) {
        let [hour, day, month, year] = str.split('-');
        this.stamp = new Date(year, month - 1, day, hour, 0, 0).getTime();
        setInterval(() => { emitter.emit('', [str, this.stamp]) }, 1000);
    }
}

let timer1 = new Timer("0-20-1-2022");
let timer2 = new Timer("21-28-7-2021");