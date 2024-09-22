import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
@inject(EventAggregator)
export class GameState {
    @bindable value;
    gameStates = ['names', 'win', 'lose'];

    constructor(EventAggregator) {
        this._eventAggregator = EventAggregator;
        this._gameState = this.gameStates[this._state];
        this._direction = 1;
        this.state = 0;
    }

    attached() {
        this._startSubscription = this._eventAggregator.subscribe('start', names => this._start(names));
        this._lostSubscription = this._eventAggregator.subscribe('gameResult', result => this._finish(result));
        this._bounceSubscription = this._eventAggregator.subscribe('bounce', _ => this._bounce());
        this._nextSubscription = this._eventAggregator.subscribe('next', _ => this._next());
    }

    _start(names) {
        this._names = names;
        this.name = this._randomName();
        this.state = 1;
    }

    _next() {
        this.name = this._nextName();
        this.state = 2;
    }

    _bounce() {
        this._direction *= -1;
        this._showReward();
        this._next();
    }

    _finish(result) {
        !result && this._showReward();
        this.state = 1;
    }

    _showReward() {
        this._eventAggregator.publish('reward', this.name);
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
    }

}
