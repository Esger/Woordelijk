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

    start() {
        if (this.persons.length < 1) return;

        this._eventAggregator.publish('start', this.persons);
    }
}
