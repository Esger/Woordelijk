import { bindable } from 'aurelia-framework';

export class Names {
    @bindable value;
    title = 'Wie doet er mee?';
    names = [];

    addName(name) {
        if (name === '') return;
        this.names.push(name);
    }
}
