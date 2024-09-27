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
        this._addPlaySubscription();
        this._addEscapeSubscriptiono();
    }

    _addEscapeSubscriptiono() {
        if (this._escapeKeyPressedSubscription && !this.spinnerReady) return;
        this._escapeKeyPressedSubscription = this._eventAggregator.subscribeOnce('escapeKeyPressed', _ => {
            if (!this.spinnerReady) return;
            this.bounce();
            this._escapeKeyPressedSubscription = null;
        });
    }

    _addPlaySubscription() {
        if (this._playKeyPressedSubscription && !this.spinnerReady) return;
        this._playKeyPressedSubscription = this._eventAggregator.subscribeOnce('playKeyPressed', _ => {
            if (this.spinnerReady) {
                this.next();
            } else {
                this.spinIt();
            }
            this._playKeyPressedSubscription = null;
        });
    }

    detached() {
        this.spin = false;
        this.spinnerReady = false;
        this._escapeKeyPressedSubscription?.dispose();
        this._playKeyPressedSubscription?.dispose();
    }

    _randomLetters() {
        this.letters = [];
        for (let i = 0; i < this._maxLetters; i++) {
            const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            this.letters.push(randomLetter);
        }
    }

    spinIt() {
        if (this.spinnerReady) return;
        this.spin = true;
        this.spinnerReady = false;
        $('spinner ul').one('transitionend', _ => {
            this.spinnerReady = true;
            this._addPlaySubscription();
            this._addEscapeSubscriptiono();
            this._eventAggregator.publish('spinnerReady');
        });
    }

    next() {
        if (!this.spinnerReady) return;
        this._eventAggregator.publish('next');
        this.spinnerReady = false;
        this.spin = false;
    }

    bounce() {
        this._eventAggregator.publish('bounce');
        this.spinnerReady = false;
        this.spin = false;
    }
}
