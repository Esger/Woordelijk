import { bindable } from 'aurelia-framework';

export class LeaderBoardCustomElement {
    @bindable persons;
    @bindable state = 0;


    showLeaderBoard() {
        $('leader-board dialog')[0].showModal();
    }
}
