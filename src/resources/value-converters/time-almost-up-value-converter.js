export class TimeAlmostUpValueConverter {
    toView(time) {
        if (!time) return;
        if (time < 15) return Math.round(time);
    }
}
