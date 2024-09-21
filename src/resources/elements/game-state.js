import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
@inject(EventAggregator)
export class GameState {
  @bindable value;
  gameStates = ['names', 'win', 'lose'];

  constructor(EventAggregator) {
    this._eventAggregator = EventAggregator;
    this.state = 0;
    this._gameState = this.gameStates[this._state];
  }

  attached() {
    this._startSubscription = this._eventAggregator.subscribe('start', names => {
      this.state = 1;
    })
  }

  detached() {
    this._startSubscription.dispose();
  }

  enterNames(gameState) {
    return 0 === gameState;
  }
}
