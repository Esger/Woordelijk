import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
@inject(EventAggregator)
export class Game {
    @bindable name;

    constructor(EventAggregator) {
        this._eventAggregator = EventAggregator;
    }

    attached() {
        this.randomLetterReady = false;
        this._addSpinnerReadySubscription();
    }

    _addSpinnerReadySubscription() {
        if (this._spinnerReadySubscription) return;
        this._spinnerReadySubscription = this._eventAggregator.subscribe('spinnerReady', _ => {
            this.randomLetterReady = true;
            this._spinnerReadySubscription = null;
            this._addPlaySubscription();
            this._addEscapeSubscriptiono();
        });
    }

    _addEscapeSubscriptiono() {
        if (this._escapeKeyPressedSubscription || !this.randomLetterReady) return;
        this._escapeKeyPressedSubscription = this._eventAggregator.subscribeOnce('escapeKeyPressed', _ => {
            this.bounce();
            this._escapeKeyPressedSubscription = null;
        });
    }

    _addPlaySubscription() {
        if (this._playKeyPressedSubscription || !this.randomLetterReady) return;
        this._playKeyPressedSubscription = this._eventAggregator.subscribeOnce('playKeyPressed', _ => {
            this.next();
            this._playKeyPressedSubscription = null;
        });
    }

    detached() {
        this.randomLetterReady = false;
        this._escapeKeyPressedSubscription?.dispose();
        this._playKeyPressedSubscription?.dispose();
    }

    next() {
        if (!this.randomLetterReady) return;
        this._eventAggregator.publish('next');
        this.randomLetterReady = false;
    }

    bounce() {
        this._eventAggregator.publish('bounce');
        this.randomLetterReady = false;
    }
}
