import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
@inject(EventAggregator)

export class Result {
    @bindable name = '';

    constructor(EventAggregator) {
        this._eventAggregator = EventAggregator;
    }

    attached() {
        this._playKeyPressedSubscription = this._eventAggregator.subscribe('playKeyPressed', _ => {
            this.gameResult(true);
        });
    }

    detached() {
        this._playKeyPressedSubscription.dispose();
    }

    gameResult(result) {
        this._eventAggregator.publish('gameResult', result);
    }
}
