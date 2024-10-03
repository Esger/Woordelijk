import { bindable, inject } from 'aurelia-framework';

@inject(Element)
export class ProgressBarCustomElement {
    @bindable value;
    @bindable state;
    constructor(element) {
        this.element = element;
    }

    attached() {
        this._setBarColor('green');
        this._initialValue = undefined;
    }

    valueChanged(newValue) {
        if (this._initialValue === undefined)
            this._initialValue = newValue;
        const percentage = (1 - (this._initialValue - newValue) / this._initialValue) * 100;
        this.element.style.setProperty('--value', percentage + '%');
        if (percentage < 33) {
            this._setBarColor('orange');
            this.targetElement = document.getElementById('time');
        }
        if (percentage < 15)
            this._setBarColor('crimson');
    }

    _setBarColor(color) {
        document.body.style.setProperty('--gradientColor', color);
    }
}
