import { bindable } from 'aurelia-framework';

export class Names {
  @bindable names = [];
  title = 'Wie doet er mee?';
  minLength = 3;

  addName(name) {
    const isLongEnough = name.length >= this.minLength;
    if (!isLongEnough) return;
    this.names.push(name);
  }
}
