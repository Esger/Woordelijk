import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
@inject(EventAggregator)
export class Names {
    @bindable names = [];
    title = 'Wie doet er mee?';
    minLength = 3;

    constructor(EventAggregator) {
        this._eventAggregator = EventAggregator;
    }

    attached() {
        const names = localStorage.getItem('names');
        if (names) {
            this.names = JSON.parse(names);
        }
    }

    addName(name) {
        const isLongEnough = name.length >= this.minLength;
        if (!isLongEnough) return;
        this.names.push(name);
        localStorage.setItem('names', JSON.stringify(this.names));
        this.name = '';
    }

    removeName(name) {
        this.names.splice(this.names.indexOf(name), 1);
        localStorage.setItem('names', JSON.stringify(this.names));
    }

    start() {
        this._eventAggregator.publish('start', this.names);
    }
}
