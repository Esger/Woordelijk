import { inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class LeaderBoardCustomElement {
    @bindable persons;
    @bindable state = 0;
    @bindable letterReady = false;

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
    }

    showLeaderBoard() {
        this._eventAggregator.publish('showLeaderBoard');
        $('leader-board dialog')[0].showModal();
    }
}
