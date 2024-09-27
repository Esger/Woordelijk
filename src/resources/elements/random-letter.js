import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class RandomLetter {
    constructor(EventAggregator) {
        this._eventAggregator = EventAggregator;
        this._maxLetters = 30;
    }

    attached() {
        this.spin = false;
        this.letters = this._randomLetters();
        this._addPlaySubscription();
    }

    detached() {
        this._playKeyPressedSubscription?.dispose();
        this.spin = false;
    }

    _addPlaySubscription() {
        if (this._playKeyPressedSubscription) return;
        this._playKeyPressedSubscription = this._eventAggregator.subscribeOnce('playKeyPressed', _ => {
            this.spinIt();
            this._playKeyPressedSubscription = null;
        });
    }
    _randomLetters() {
        const letters = [];
        for (let i = 0; i < this._maxLetters; i++) {
            const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            letters.push(randomLetter);
        }
        return letters;
    }

    spinIt() {
        if (this.spin) return;
        this.spin = true;
        $('spinner ul').one('transitionend', _ => this._eventAggregator.publish('spinnerReady'));
    }
}
