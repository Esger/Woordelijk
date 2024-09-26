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

        this._escapeKeyPressedSubscription = this._eventAggregator.subscribe('escapeKeyPressed', _ => {
            this.gameResult(false);
        });
    }

    detached() {
        this._playKeyPressedSubscription.dispose();
        this._escapeKeyPressedSubscription.dispose();
    }

    gameResult(result) {
        this._eventAggregator.publish('gameResult', result);
    }
}
