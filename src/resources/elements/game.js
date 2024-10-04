import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
@inject(EventAggregator)
export class Game {
    @bindable name = '';
    @bindable letterReady = false;
    @bindable showReward = false;
    @bindable timeLimited = false;
    @bindable gameTime = 0;

    constructor(EventAggregator) {
        this._eventAggregator = EventAggregator;
    }

    next() {
        this._eventAggregator.publish('next');
    }

    bounce() {
        this._eventAggregator.publish('bounce');
    }
}
