import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
@inject(Element, EventAggregator)
export class Reward {
    @bindable value;

    constructor(Element, EventAggregator) {
        this._element = Element;
        this._eventAggregator = EventAggregator;
        this._rewardSubscription = this._eventAggregator.subscribe('reward', name => this.open(name));
    }

    attached() {
        this._dialog = this._element.querySelector('dialog');
    }

    detached() {
        this._rewardSubscription.dispose();
    }

    open(name) {
        this._dialog.showModal(name);
    }
    close() {
        this._dialog.close();
    }
}
