import { inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SettingsService } from 'services/settings-service';
@inject(EventAggregator, SettingsService)
export class PersonsCustomElement {
    @bindable state = 0;
    title = 'Strijders';
    minLength = 1;
    name;

    constructor(eventAggregator, settingsService) {
        this._eventAggregator = eventAggregator;
        this._settingsService = settingsService;
        this.persons = [];
    }

    attached() {
        const persons = this._settingsService.getSettings('persons');
        if (persons) this.persons = persons;
        this._resetScores();
        this.gameTime = this._settingsService.getSettings('gameTime') || 30;
        this.timeLimited = this._settingsService.getSettings('timeLimited') || false;
        this._settingsService.saveSettings('gameTime', this.gameTime);
        this._settingsService.saveSettings('timeLimited', this.timeLimited);
        this._showLeaderBoardSubscription = this._eventAggregator.subscribe('showLeaderBoard', _ => this.sortLeaders())
    }

    detached() {
        this._showLeaderBoardSubscription.dispose();
    }

    sortLeaders() {
        const persons = this._settingsService.getSettings('persons');
        this.persons = persons.sort((a, b) => b.score - a.score);
    }

    newPerson(name) {
        const person = {
            name: name,
            score: 0
        };
        return person;
    }

    addName(name) {
        const isLongEnough = name?.length >= this.minLength;
        if (!isLongEnough) return;
        let newPerson = this.newPerson(name);
        if (!this.persons.find(person => person.name == name)) {
            this.persons.push(newPerson);
            this._settingsService.saveSettings('persons', this.persons);
            this._eventAggregator.publish('settingsChanged');
        };

        this.name = '';
    }

    removeName(name) {
        const person = this.persons.find(person => person.name == name);
        if (!person) return;
        this.persons.splice(this.persons.indexOf(person), 1);
        this._settingsService.saveSettings('persons', this.persons);
        this._eventAggregator.publish('settingsChanged');
    }

    _resetScores() {
        this.persons.forEach(person => person.score = 0);
        this._settingsService.saveSettings('persons', this.persons);
    }

    resetScore(name) {
        const person = this.persons.find(person => person.name == name);
        if (!person) return;
        person.score = 0;
        this._settingsService.saveSettings('persons', this.persons);
    }

    incrementTime() {
        switch (true) {
            case this.gameTime < 30:
                this.gameTime += 5;
                break;
            case this.gameTime < 60:
                this.gameTime += 10;
                break;
            case this.gameTime < 180:
                this.gameTime += 30;
                break;
            default:
                this.gameTime += 60;
                break;
        }
        this.gameTime = this.gameTime % 3600;
        this._settingsService.saveSettings('gameTime', this.gameTime);
    }

    decrementTime() {
        switch (true) {
            case this.gameTime >= 180:
                this.gameTime -= 60;
                break;
            case this.gameTime > 60:
                this.gameTime -= 30;
                break;
            case this.gameTime >= 40:
                this.gameTime -= 10;
                break;
            case this.gameTime > 5:
                this.gameTime -= 5;
                break;
        }
        this._settingsService.saveSettings('gameTime', this.gameTime);
    }

    setTimeLimit(event) {
        const timeLimited = event.target.checked;
        this._settingsService.saveSettings('timeLimited', timeLimited);
        this._settingsService.saveSettings('gameTime', this.gameTime);
        this._eventAggregator.publish('settingsChanged');
    }

    start() {
        this._eventAggregator.publish('start');
    }
}
