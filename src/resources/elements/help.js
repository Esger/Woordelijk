import { bindable } from 'aurelia-framework';

export class Help {
    showHelp() {
        $('help dialog')[0].showModal();
    }
}
