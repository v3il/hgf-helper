import { Container } from 'typedi';
import { LocalSettingsService, SettingsService } from './services';
import { BasicFacade } from '../BasicFacade';

export class SettingsFacade extends BasicFacade {
    // static #instance;
    // static container = Container.of('settings');

    static providers = [
        { id: SettingsService, factory: () => SettingsService.create() },
        { id: LocalSettingsService, factory: () => LocalSettingsService.create() }
    ];

    // static get instance() {
    //     if (!this.#instance) {
    //         this.container.set(this.providers.concat({ id: this, type: this }));
    //         this.#instance = this.container.get(this);
    //     }
    //
    //     return this.#instance;
    // }

    #settingsService;
    #localSettingsService;

    constructor(container) {
        super();

        this.#settingsService = container.get(SettingsService);
        this.#localSettingsService = container.get(LocalSettingsService);
    }

    async loadSettings() {
        this.#localSettingsService.loadSettings();
        await this.#settingsService.loadSettings();
    }

    getGlobalSetting(settingName) {
        return this.#settingsService.getSetting(settingName);
    }

    updateGlobalSettings(settings) {
        this.#settingsService.updateSettings(settings);
    }

    getLocalSetting(settingName) {
        return this.#localSettingsService.getSetting(settingName);
    }

    updateLocalSettings(settings) {
        this.#localSettingsService.updateSettings(settings);
    }
}
