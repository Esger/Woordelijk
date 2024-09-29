import { bindable } from 'aurelia-framework';

export class LeaderBoardCustomElement {
    @bindable persons;


    showLeaderBoard() {
        $('leader-board dialog')[0].showModal();
    }
}
