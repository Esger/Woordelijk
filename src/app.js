import { inject } from 'aurelia-framework';
import $ from 'jquery';
import { KeyInputService } from 'services/key-input-service';
@inject(KeyInputService)
export class App {
    constructor(keyInputService) {
        this._keyInputService = keyInputService;
    }

    attached() {
        $(window.visualViewport).on('resize', _ => requestAnimationFrame(this._scaleGame));
        this._scaleGame();
    }

    _scaleGame() {
        const width = window.visualViewport.width;
        const scale = (width - 32) / (width);
        if (document.documentElement.clientWidth < 600) {
            document.body.style.setProperty('--scale', scale)
        }
    }

}
