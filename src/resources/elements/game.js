import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
@inject(EventAggregator)
export class Game {
    @bindable name = '';
    @bindable letterReady = false;
    @bindable showReward = false;
    @bindable timedGame = false;
    @bindable gameTime = 0;

    constructor(EventAggregator) {
        this._eventAggregator = EventAggregator;
    }

    attached() {
        this._escapeKeyPressedSubscription = this._eventAggregator.subscribe('escapeKeyPressed', _ => this.bounce());
        this._playKeyPressedSubscription = this._eventAggregator.subscribe('playKeyPressed', _ => this.next());
        this._letterReadySubscription = this._eventAggregator.subscribe('spinnerReady', _ => this._startTimer());
    }

    detached() {
        this._escapeKeyPressedSubscription.dispose();
        this._playKeyPressedSubscription.dispose();
    }

    next() {
        if (!this.letterReady || this.showReward) return;
        this._eventAggregator.publish('next');
    }

    bounce() {
        if (!this.letterReady || this.showReward) return;
        this._eventAggregator.publish('bounce');
    }

    _startTimer() {
        if (!this.timedGame) return;
        const interval = setInterval(_ => {
            if (this.gameTime <= 0) {
                clearInterval(interval);
                return;
            }
            this.gameTime -= .02;
        }, 20);
    }
}
