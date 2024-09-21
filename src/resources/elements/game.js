import { bindable } from 'aurelia-framework';

export class Game {
  @bindable name;

  attached() {
    this.randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  }

  gameResult() {
    //
  }

  bounce() {
    //
  }
}
