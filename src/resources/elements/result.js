import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
@inject(EventAggregator)

export class Result {
    @bindable name = '';
    @bindable showReward = false;
    @bindable timedGame = false;
    @bindable gameTime = 0;

    constructor(EventAggregator) {
        this._eventAggregator = EventAggregator;
    }

    attached() {
        this._decided = false;
        this._playKeyPressedSubscription = this._eventAggregator.subscribe('playKeyPressed', _ => this.gameResult(true));
        this._escapeKeyPressedSubscription = this._eventAggregator.subscribe('escapeKeyPressed', _ => this.gameResult(false));
        this._startTimer();
    }

    detached() {
        this._playKeyPressedSubscription.dispose();
        this._escapeKeyPressedSubscription.dispose();
        this._stopTimer();
    }

    gameResult(result) {
        if (this._decided || this.showReward) return;
        this._decided = true;
        this._eventAggregator.publish('gameResult', result);
        this._stopTimer();
    }
    _startTimer() {
        if (!this.timedGame) return;
        this._stopTimer();
        this.interval = setInterval(_ => {
            if (this.gameTime <= 0) {
                this._stopTimer();
                this.gameResult(false);
                return;
            }
            this.gameTime -= .02;
        }, 20);
    }
    _stopTimer() {
        clearInterval(this.interval);
        this.interval = null;
    }
}
