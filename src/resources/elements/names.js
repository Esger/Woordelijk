import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
@inject(EventAggregator)
export class Names {
  @bindable names = [];
  title = 'Wie doet er mee?';
  minLength = 3;

  constructor(EventAggregator) {
    this._eventAggregator = EventAggregator;
  }

  addName(name) {
    const isLongEnough = name.length >= this.minLength;
    if (!isLongEnough) return;
    this.names.push(name);
    this.name = '';
  }

  start() {
    this._eventAggregator.publish('start', this.names);
  }
}
