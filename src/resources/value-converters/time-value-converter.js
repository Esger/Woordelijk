export class TimeValueConverter {
    toView(time, short = false) {
        if (!time) return;
        if (time < 60) return Math.floor(time);
        else return Math.floor(time / 60) + ':' + Math.floor(time % 60);
    }

    fromView(time) {
        return parseInt(time, 10);
    }
}
