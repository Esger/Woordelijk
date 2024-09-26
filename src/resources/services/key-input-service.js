import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class KeyInputService {

    constructor(eventAggregator) {
        this._eventAggregator = eventAggregator;
        this._debounceDelay = 1000;
        this._setupKeydownListener();
    }

    _debounce(func, wait) {
        this._timeout;
        return function () {
            const context = this, args = arguments;
            clearTimeout(this._timeout);
            this._timeout = setTimeout(_ => {
                func.apply(context, args);
            }, wait);
        };
    }


    _setupKeydownListener() {
        this.debouncedHandler = this._debounce(event => {
            if (event.target.tagName === 'INPUT') return;
            if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;
            event.preventDefault();
            this.handleKeyInput(event);
        }, this._debounceDelay);

        document.addEventListener('keydown', this.debouncedHandler);
    }

    detached() {
        // Don't forget to remove the event listener when the component is detached
        document.removeEventListener('keydown', this.debouncedHandler);
    }


    handleKeyInput(event) {
        const key = event.code?.toLowerCase()

        switch (key) {
            case 'enter':
                this._eventAggregator.publish('playKeyPressed');
                break;
            case 'space':
                this._eventAggregator.publish('playKeyPressed');
                break;
            case 'escape':
                this._eventAggregator.publish('escapeKeyPressed');
                break;
            case 'keyb':
                this._eventAggregator.publish('escapeKeyPressed');
                break;
            // default:
            //     if (key.startsWith('key')) {
            //         const letter = key.slice(-1);
            //         this._eventAggregator.publish('key', letter);
            //     }
            //     break;
        }
        return true;
    }

}
