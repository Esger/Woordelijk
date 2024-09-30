import { bindable, inject } from 'aurelia-framework';

@inject(Element)
export class ProgressBarCustomElement {
    @bindable value;
    constructor(element) {
        this.element = element;
        this._initialValue;
    }

    attached() {
        this._setBarColor('green');
    }

    valueChanged(newValue) {
        if (this._initialValue === undefined)
            this._initialValue = newValue;
        const percentage = (1 - (this._initialValue - newValue) / this._initialValue) * 100;
        this.element.style.setProperty('--value', percentage + '%');
        if (percentage < 33)
            this._setBarColor('orange');
        if (percentage < 15)
            this._setBarColor('red');
    }

    _setBarColor(color) {
        this.element.style.setProperty('--gradientColor', color);
    }
}
