import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
@inject(EventAggregator)
export class Game {
    @bindable name = '';
    @bindable letterReady = false;
    @bindable showReward = false;

    constructor(EventAggregator) {
        this._eventAggregator = EventAggregator;
    }

    attached() {
        this._escapeKeyPressedSubscription = this._eventAggregator.subscribe('escapeKeyPressed', _ => this.bounce());
        this._playKeyPressedSubscription = this._eventAggregator.subscribe('playKeyPressed', _ => this.next());
    }

    detached() {
        this._escapeKeyPressedSubscription.dispose();
        this._playKeyPressedSubscription.dispose();
    }

    next() {
        if (!this.letterReady || this.showReward) return;
        this._eventAggregator.publish('next');
    }

    bounce() {
        if (!this.letterReady || this.showReward) return;
        this._eventAggregator.publish('bounce');
    }
}
