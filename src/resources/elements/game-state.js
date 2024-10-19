import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SettingsService } from 'services/settings-service';
@inject(EventAggregator, SettingsService)
export class GameState {
    title = 'Woordelijk!';

    constructor(eventAggregator, settingsService) {
        this._eventAggregator = eventAggregator;
        this._settingsService = settingsService;
        this._getSettings();
        this._rewardDuration = 800;
        this._direction = 1;
        this.letterReady = false;
        this.showReward = false;
        this.scorer = null;
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
        this._settingsChangedSubscription = this._eventAggregator.subscribe('settingsChanged', _ => this._getSettings());
    }
    _start() {
        this._getSettings();
        this.person = this._randomPerson();
        this.state = 1;
    }

    _repeatStateNextPerson() {
        this.person = this._nextPerson();
        this.state = undefined;
        setTimeout(_ => {
            this.state = 1;
        });
    }

    _nextState() {
        if (!this.letterReady || this.showReward) return;
        this._setScore(this.person);
        this.person = this._nextPerson();
        this.state = 2;
        setTimeout(_ => this._startTimer());
    }

    _bounce() {
        if (!this.letterReady || this.showReward) return;
        this.winner = this.person;
        this._setScore(this.person, true);
        this._showReward();
        const halfway = this._rewardDuration / 2;
        setTimeout(_ => {
            setTimeout(_ => this._startTimer(), halfway);
            this._direction *= -1;
            this.person = this._nextPerson();
            this.state = 2;
        }, halfway);
    }

    _finish(result) {
        this._result = result;
        const halfway = !result * this._rewardDuration / 2;
        setTimeout(_ => this.state = 1, halfway);
        this.letterReady = false;
        this.winner = this.lastPerson;
        this._setScore(this.lastPerson);
        if (!result) {
            this._showReward();
        }
    }

    _nextPerson() {
        this.lastPerson = this.person;
        this._personIndex += this._direction;
        this._personIndex = (this._personIndex + this._persons.length) % this._persons.length;
        return this._persons[this._personIndex];
    }

    _startTimer() {
        if (!this.timeLimited) return;
        this.gameTime = this._initialGameTime;
        this.interval = setInterval(_ => {
            const step = .02;
            if (this.gameTime < step) {
                this.letterReady = false;
                this._stopTimer();
                switch (this.state) {
                    case 1: this._repeatStateNextPerson(); break;
                    case 2: this._finish(false); break;
                }
            } else
                this.gameTime -= step;
        }, 20);
    }

    _stopTimer() {
        if (!this.interval) return 1;
        const time = this.gameTime;
        clearInterval(this.interval);
        this.interval = null;
        return time;
    }

    _setScore(scorer, bounce = false) {
        if (!scorer) return;
        let score = 0;
        const timeLeft = this._stopTimer();
        const bounceScore = bounce ? this.timeLimited ? this._maxScore : 2 : 0;
        const ratio = timeLeft / this._initialGameTime; // 0-1
        let timeScore = this.timeLimited ? Math.ceil(ratio * this._maxScore) : 1;
        if (this.state === 2 && this.timeLimited) {
            if (!this._result)
                score += this._maxScore;
            timeScore = this._maxScore - timeScore;
        }
        score += timeScore + bounceScore;

        scorer.score = scorer.score !== undefined ? scorer.score + score : score;
        console.log(`Score: ${score} for ${scorer.name}`);
        this._saveSettings();
    }

    _saveSettings() {
        this._settingsService.saveSettings('persons', this._persons);
    }

    _getSettings() {
        this._persons = this._settingsService.getSettings('persons') || [];
        this.timeLimited = this._settingsService.getSettings('timeLimited') || false;
        this._maxScore = this.timeLimited ? 10 : 1;
        this._initialGameTime = this._settingsService.getSettings('gameTime') || 30;
        this._historicPersons = this._settingsService.getSettings('historicPersons') || [];
    }

    _showReward() {
        this.showReward = true;
        setTimeout(_ => this.showReward = false, this._rewardDuration);
    }

    _randomPerson() {
        this._personIndex = Math.floor(Math.random() * this._persons.length);
        return this._persons[this._personIndex];
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
        $(window.visualViewport).off('resize');
    }

}
