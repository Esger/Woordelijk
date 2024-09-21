import { bindable } from 'aurelia-framework';

export class GameState {
  @bindable value;
  gameStates = ['names', 'win', 'lose'];

  constructor() {
    this._gameState = this.gameStates[0];
  }
}
