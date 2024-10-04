export class TimeWithUnitValueConverter {
    toView(time, short = false) {
        if (!time) return;
        if (time < 60) return Math.floor(time) + ' s';
        else return Math.floor(time / 60) + ':' + (Math.floor(time % 60)).toString().padStart(2, '0') + ' m';
    }

    fromView(time) {
        return parseInt(time, 10);
    }
}
