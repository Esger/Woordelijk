import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SettingsService } from 'services/settings-service';
@inject(EventAggregator, SettingsService)
export class GameState {

    constructor(eventAggregator, settingsService) {
        this._eventAggregator = eventAggregator;
        this._settingsService = settingsService;
        this._rewardDuration = 800;
        this.letterReady = false;
        this._direction = 1;
        this.state = 0;
        this.showReward = false;
        this.winner = '';
    }

    attached() {
        this._startSubscription = this._eventAggregator.subscribe('start', data => {
            this._start(data.persons);
            if (data.timed) {
                this.timedGame = true;
                this.gameTime = data.time;
            } else {
                this.timedGame = false;
            }
        });
        this._lostSubscription = this._eventAggregator.subscribe('gameResult', result => this._finish(result));
        this._bounceSubscription = this._eventAggregator.subscribe('bounce', _ => this._bounce());
        this._nextSubscription = this._eventAggregator.subscribe('next', _ => this._next());
        this._spinnerReadySubscription = this._eventAggregator.subscribe('spinnerReady', _ => this.letterReady = true);
    }

    _start(persons) {
        this._historicPersons = this._settingsService.getSettings('historicPersons');
        this._persons = persons;
        this.person = this._randomPerson();
        this.state = 1;
    }

    _next() {
        if (!this.letterReady) return;
        this.person = this._nextName();
        this.state = 2;
    }

    _bounce() {
        this.winner = this.person.name;
        this.person.score++;
        this._saveSettings();
        this._showReward();
        const halfway = this._rewardDuration / 2;
        setTimeout(_ => {
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
        const halfway = !result * this._rewardDuration / 2;
        setTimeout(_ => this.state = 1, halfway);
        this.letterReady = false;
        if (!result) {
            this.winner = this.lastPerson.name;
            this.lastPerson.score++;
            this._saveSettings();
            this.lastPerson.score++;
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

    detached() {
        this._startSubscription.dispose();
        this._lostSubscription.dispose();
        this._bounceSubscription.dispose();
        this._nextSubscription.dispose();
        this._spinnerReadySubscription.dispose();
    }

}
