export class TimeValueConverter {
    toView(time) {
        if (!time) return;
        if (time < 60) return Math.round(time) + ' sec.';
        else return Math.round(time / 60) + ' min.'
    }

    fromView(time) {
        return parseInt(time, 10);
    }
}
