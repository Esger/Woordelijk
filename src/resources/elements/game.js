import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
@inject(EventAggregator)
export class Game {
    @bindable name;

    constructor(EventAggregator) {
        this._eventAggregator = EventAggregator;
        this._maxLetters = 50;
    }

    attached() {
        // this.spin = false;
        this.letters = new Array(this._maxLetters);
        for (let i = 0; i < this.letters.length; i++) {
            this.letters[i] = this._randomLetter();
        }
        setTimeout(() => {
            this.spin = true;
        });
    }

    detached() {
        this.spin = false;
    }

    _randomLetter() {
        return String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }

    next() {
        this._eventAggregator.publish('next');
    }

    bounce() {
        this._eventAggregator.publish('bounce');
    }
}
