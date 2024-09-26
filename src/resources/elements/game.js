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
        this.spinnerReady = false;
        this.spin = false;
        this._randomLetters();
        this._playKeyPressedSubscription = this._eventAggregator.subscribe('playKeyPressed', _ => {
            this.next();
        })
    }

    detached() {
        this.spin = false;
        this._playKeyPressedSubscription.dispose();
    }

    _randomLetters() {
        this.letters = [];
        for (let i = 0; i < this._maxLetters; i++) {
            const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            this.letters.push(randomLetter);
        }
    }

    spinIt() {
        this.spin = true;
        this.spinnerReady = false;
        $('spinner ul').one('transitionend', _ => {
            this.spinnerReady = true;
            this._eventAggregator.publish('spinnerReady');
        });
    }

    next() {
        this._eventAggregator.publish('next');
        this.spinnerReady = false;
    }

    bounce() {
        this._eventAggregator.publish('bounce');
        this.spinnerReady = false;
    }
}
