import { bindable } from 'aurelia-framework';

export class GameState {
  @bindable value;
  gameStates = ['names', 'win', 'lose'];

  constructor() {
    this.state = 0;
    this._gameState = this.gameStates[this._state];
  }

  enterNames(gameState) {
    return 0 === gameState;
  }
}
