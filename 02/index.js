
const process = require('process');
const { EventEmitter } = require('events');
const emitter = new EventEmitter();

class Handler {
    static handle(timer) {
        let dif = Math.floor((timer.stamp - Date.now()) / 1000);
        if (dif > 0) {
            let s = dif % 60;
            let m = Math.floor((dif - s) / 60) % 60;
            let h = Math.floor((Math.floor((dif - s) / 60) - m) / 60) % 24;
            let d = Math.floor((Math.floor((Math.floor((dif - s) / 60) - m) / 60) - h) / 24);
            console.log(`${d} days, ${h} hours, ${m} minutes, ${s} seconds until ${timer.str}.`);
        }
        else {
            console.log(`${timer.str} is in the past.`)
            timer.stop();
        }
    }
}

emitter.on('', Handler.handle);

class Timer {
    constructor(str) {
        this.str = str;
        let [hour, day, month, year] = str.split('-');
        this.stamp = new Date(year, month - 1, day, hour, 0, 0).getTime();
        this.interval = setInterval(() => { emitter.emit('', this) }, 1000);
    }

    stop = function () {
        clearInterval(this.interval);
    }
}

let timer1 = new Timer("0-20-1-2022");
let timer2 = new Timer("21-28-7-2021");
let timer3 = new Timer("21-28-7-2020");