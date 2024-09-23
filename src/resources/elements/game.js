import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
@inject(EventAggregator)
export class Game {
    @bindable name;

    constructor(EventAggregator) {
        this._eventAggregator = EventAggregator;
        this._maxLetters = 30;
    }

    attached() {
        this._randomLetters();
        this.buttonsDisabled = true;
    }

    detached() {
        this.spin = false;
    }

    _randomLetters() {
        this.letters = [];
        this.letters.push('?');
        for (let i = 0; i < this._maxLetters; i++) {
            const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            this.letters.push(randomLetter);
        }
    }

    spinIt() {
        this.spin = true;
        $('spinner ul').one('transitionend', _ => {
            this.buttonsDisabled = false;
        });
    }

    next() {
        this._eventAggregator.publish('next');
    }

    bounce() {
        this._eventAggregator.publish('bounce');
    }
}
