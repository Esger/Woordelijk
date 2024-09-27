import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
@inject(EventAggregator)

export class Result {
    @bindable name = '';

    constructor(EventAggregator) {
        this._eventAggregator = EventAggregator;
    }

    attached() {
        this._playKeyPressedSubscription = this._eventAggregator.subscribeOnce('playKeyPressed', _ => {
            this.gameResult(true);
            this._playKeyPressedSubscription = null;
        });

        this._escapeKeyPressedSubscription = this._eventAggregator.subscribeOnce('escapeKeyPressed', _ => {
            this.gameResult(false);
            this._escapeKeyPressedSubscription = null;
        });
    }

    detached() {
        this._playKeyPressedSubscription?.dispose();
        this._escapeKeyPressedSubscription?.dispose();
    }

    gameResult(result) {
        this._eventAggregator.publish('gameResult', result);
    }
}
