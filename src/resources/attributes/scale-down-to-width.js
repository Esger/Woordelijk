import { inject } from 'aurelia-framework';

@inject(Element)
export class ScaleDownToWidthCustomAttribute {
    constructor(element) {
        this._element = element;
        this._$element = $(this._element);
    }
    bind() {
        $(window.visualViewport).on('resize', _ => requestAnimationFrame(this._scaleGame.bind(this)));
        setTimeout(_ => this._scaleGame(), 50);
    }

    _scaleGame() {
        const width = this._$element.width();
        const diff = window.visualViewport.width - width;
        this._$element.css('margin-inline', `${diff / 2}px`);
        const scale = Math.min(1, (window.visualViewport.width - 32) / width);
        if (window.visualViewport.width < (600 - 32))
            document.body.style.setProperty('--scale', scale);
    }
}
