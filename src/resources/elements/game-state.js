import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SettingsService } from 'services/settings-service';
@inject(EventAggregator, SettingsService)
export class GameState {

    constructor(eventAggregator, settingsService) {
        this._eventAggregator = eventAggregator;
        this._settingsService = settingsService;
        this._rewardDuration = 800;
        this._direction = 1;
        this.letterReady = false;
        this.showReward = false;
        this.timeLimited = false;
        this.winner = '';
        this.state = 0;
    }

    attached() {
        this._startSubscription = this._eventAggregator.subscribe('start', _ => {
            this._start();
        })
        this._escapeKeyPressedSubscription = this._eventAggregator.subscribe('escapeKeyPressed', _ => {
            switch (this.state) {
                case 1: this._bounce(); break;
                case 2: this._finish(false); break;
            }
        });
        this._playKeyPressedSubscription = this._eventAggregator.subscribe('playKeyPressed', _ => {
            switch (this.state) {
                case 0: this._start(); break;
                case 1: this._nextState(); break;
                case 2: this._finish(true); break;
            }
        });
        this._nextSubscription = this._eventAggregator.subscribe('next', _ => this._nextState());
        this._bounceSubscription = this._eventAggregator.subscribe('bounce', _ => this._bounce());
        this._spinnerReadySubscription = this._eventAggregator.subscribe('spinnerReady', _ => {
            this.letterReady = true;
            this._startTimer();
        });
        this._lostSubscription = this._eventAggregator.subscribe('gameResult', result => this._finish(result));
    }

    _start() {
        this._getSettings();
        this.person = this._randomPerson();
        this.state = 1;
    }

    _getSettings() {
        this._persons = this._settingsService.getSettings('persons');
        if (this._persons.length < 1) return;
        this.timeLimited = this._settingsService.getSettings('timeLimited');
        if (this.timeLimited) {
            this._initialGameTime = this._settingsService.getSettings('gameTime');
            this.gameTime = this._initialGameTime;
        }
        this._historicPersons = this._settingsService.getSettings('historicPersons');
    }

    _repeatStateNextPerson() {
        this._getSettings();
        this.person = this._nextName();
        this.state = undefined;
        setTimeout(_ => {
            this.state = 1;
        });
    }

    _nextState() {
        if (!this.letterReady || this.showReward) return;
        this._stopTimer();
        this._getSettings();
        this.person = this._nextName();
        this.state = 2;
        setTimeout(_ => this._startTimer());
    }

    _bounce() {
        if (!this.letterReady || this.showReward) return;
        this._stopTimer();
        this.winner = this.person.name;
        this.person.score++;
        this._getSettings();
        this._saveSettings();
        this._showReward();
        const halfway = this._rewardDuration / 2;
        setTimeout(_ => {
            setTimeout(_ => this._startTimer(), halfway);
            this._direction *= -1;
            this.person = this._nextName();
            this.state = 2;
        }, halfway);
    }

    _nextName() {
        this.lastPerson = this.person;
        this._personIndex += this._direction;
        this._personIndex = (this._personIndex + this._persons.length) % this._persons.length;
        return this._persons[this._personIndex];
    }

    _finish(result) {
        this._stopTimer();
        this._getSettings();
        const halfway = !result * this._rewardDuration / 2;
        setTimeout(_ => this.state = 1, halfway);
        this.letterReady = false;
        if (!result) {
            this.winner = this.lastPerson.name;
            this.lastPerson.score++;
            this._saveSettings();
            this._showReward();
        }
    }

    _saveSettings() {
        this._persons.forEach(person => {
            const indexOfHistoricPerson = this._historicPersons.findIndex(historicPerson => historicPerson.name == person.name);
            if (indexOfHistoricPerson > -1) {
                this._historicPersons[indexOfHistoricPerson].score = person.score;
            }
        });
        this._settingsService.saveSettings('persons', this._persons);
        this._settingsService.saveSettings('historicPersons', this._historicPersons);
    }

    _showReward() {
        this.showReward = true;
        setTimeout(_ => this.showReward = false, this._rewardDuration);
    }

    _randomPerson() {
        this._personIndex = Math.floor(Math.random() * this._persons.length);
        return this._persons[this._personIndex];
    }

    _startTimer() {
        if (!this.timeLimited) return;
        this.gameTime = this._initialGameTime;
        this._stopTimer();
        this.interval = setInterval(_ => {
            if (this.gameTime <= 0) {
                this.letterReady = false;
                switch (this.state) {
                    case 1: this._repeatStateNextPerson(); break;
                    case 2: this._finish(false); break;
                }
                this._stopTimer();
            }
            this.gameTime -= .02;
        }, 20);
    }

    _stopTimer() {
        clearInterval(this.interval);
        this.interval = null;
    }

    detached() {
        this._stopTimer();
        this._lostSubscription.dispose();
        this._nextSubscription.dispose();
        this._startSubscription.dispose();
        this._bounceSubscription.dispose();
        this._spinnerReadySubscription.dispose();
        this._playKeyPressedSubscription.dispose();
        this._escapeKeyPressedSubscription.dispose();
    }

}
