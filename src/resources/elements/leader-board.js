import { bindable } from 'aurelia-framework';

export class LeaderBoardCustomElement {
    @bindable persons;
    @bindable state = 0;
    @bindable letterReady = false;

    showLeaderBoard() {
        $('leader-board dialog')[0].showModal();
    }
}
