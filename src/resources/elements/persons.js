import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SettingsService } from 'services/settings-service';
@inject(EventAggregator, SettingsService)
export class PersonsCustomElement {
    title = 'Strijders';
    minLength = 1;
    name;

    constructor(eventAggregator, settingsService) {
        this._eventAggregator = eventAggregator;
        this._settingsService = settingsService;
        this.persons = [];
        this.historicPersons = [];
        this.gameTime = 30;
    }

    attached() {
        const persons = this._settingsService.getSettings('persons');
        if (persons) this.persons = persons;
        const historicPersons = this._settingsService.getSettings('historicPersons');
        if (historicPersons?.length) this.historicPersons = historicPersons;
        this._playKeyPressedSubscription = this._eventAggregator.subscribeOnce('playKeyPressed', _ => setTimeout(_ => this.start()));
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
        const indexOfHistoricPerson = this.historicPersons.findIndex(person => person.name == name);
        if (indexOfHistoricPerson > -1) {
            newPerson = this.historicPersons[indexOfHistoricPerson];
        } else {
            this.historicPersons.push(newPerson);
            this._settingsService.saveSettings('historicPersons', this.historicPersons);
        }
        if (!this.persons.find(person => person.name == name)) {
            this.persons.push(newPerson);
            this._settingsService.saveSettings('persons', this.persons);
        };

        this.name = '';
    }

    removeName(name) {
        const person = this.persons.find(person => person.name == name);
        if (!person) return;
        this.persons.splice(this.persons.indexOf(person), 1);
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
        }
    }

    start() {
        if (this.persons.length < 1) return;

        this._eventAggregator.publish('start', this.persons);
    }
}

export class TimeValueConverter {
    toView(time) {
        if (!time) return;
        if (time < 60) return time + ' sec.';
        else return time / 60 + ' min.'
    }

    fromView(time) {
        return parseInt(time, 10);
    }
}
