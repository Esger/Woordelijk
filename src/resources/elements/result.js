import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
@inject(EventAggregator)

export class Result {
    @bindable name = '';

    constructor(EventAggregator) {
        this._eventAggregator = EventAggregator;
    }

    gameResult(result) {
        this._eventAggregator.publish('gameResult', result);
    }
}
