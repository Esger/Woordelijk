import { inject } from 'aurelia-framework';

@inject(Element)
export class SquishySwitchCustomAttribute {
    constructor(element) {
        this._element = element;
    }

    bind() {
        const toggleTrack = '<div class="toggle-track"><div class="toggle-thumb"></div></div>'
        const wrapperHtml = '<div class="toggle-container green"></div>';
        $(this._element).wrap(wrapperHtml).after(toggleTrack).addClass('toggle-checkbox');
    }
}
