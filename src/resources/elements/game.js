import { bindable } from 'aurelia-framework';

export class Game {
  @bindable name;

  valueChanged(newValue, oldValue) {
    //
  }
}
