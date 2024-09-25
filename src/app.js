import { inject } from 'aurelia-framework';
import $ from 'jquery';
import { KeyInputService } from 'services/key-input-service';
@inject(KeyInputService)
export class App {
    constructor(keyInputService) {
        this._keyInputService = keyInputService;
    }
    title = 'Woordelijk!';
}
