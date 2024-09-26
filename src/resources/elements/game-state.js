import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class GameState {
    @bindable value;
    constructor(EventAggregator) {
        this._eventAggregator = EventAggregator;
        this._rewardDuration = 2400;
        this._nextEnabled = false;
        this._direction = 1;
        this.state = 0;
        this.showReward = false;
    }

    attached() {
        this._startSubscription = this._eventAggregator.subscribe('start', names => this._start(names));
        this._lostSubscription = this._eventAggregator.subscribe('gameResult', result => this._finish(result));
        this._bounceSubscription = this._eventAggregator.subscribe('bounce', _ => this._bounce());
        this._nextSubscription = this._eventAggregator.subscribe('next', _ => this._next());
        this._spinnerReadySubscription = this._eventAggregator.subscribe('spinnerReady', _ => this._nextEnabled = true);
    }

    _start(names) {
        this._names = names;
        this.name = this._randomName();
        this.state = 1;
    }

    _next() {
        if (!this._nextEnabled) return;
        this._nextEnabled = false;
        this.name = this._nextName();
        this.state = 2;
    }

    _bounce() {
        this._showReward();
        const timeout = this._rewardDuration / 2;
        setTimeout(_ => {
            this._direction *= -1;
            this.name = this._nextName();
            this.state = 2;
        }, timeout);
    }

    _finish(result) {
        const timeout = !result * this._rewardDuration / 2;
        setTimeout(_ => this.state = 1, timeout);
        !result && this._showReward();
    }

    _showReward() {
        this.showReward = true;
        setTimeout(_ => this.showReward = false, this._rewardDuration);
    }

    _nextName() {
        this._nameIndex += this._direction;
        this._nameIndex = (this._nameIndex + this._names.length) % this._names.length;
        return this._names[this._nameIndex];
    }

    _randomName() {
        this._nameIndex = Math.floor(Math.random() * this._names.length);
        return this._names[this._nameIndex];
    }

    detached() {
        this._startSubscription.dispose();
        this._lostSubscription.dispose();
        this._bounceSubscription.dispose();
        this._nextSubscription.dispose();
        this._spinnerReadySubscription.dispose();
    }

}
