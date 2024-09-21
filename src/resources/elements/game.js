import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
@inject(EventAggregator)
export class Game {
    @bindable name;

    constructor(EventAggregator) {
        this._eventAggregator = EventAggregator;
    }

    attached() {
        this.randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }

    next() {
        this._eventAggregator.publish('next');
    }

    bounce() {
        this._eventAggregator.publish('bounce');
    }
}
