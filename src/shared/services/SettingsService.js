import { BackgroundActions } from '../enums/BackgroundActions';

export class SettingsService {
    static create() {
        return new SettingsService();
    }

    #settings = {};

    get settings() {
        return this.#settings;
    }

    async loadSettings() {
        try {
            this.#settings = await chrome.runtime.sendMessage({ action: BackgroundActions.LOAD_SETTINGS });
        } catch (error) {
            console.error('Retry loadSettings', error);
            // this.loadSettings();
        }
    }

    updateSettings(patch) {
        chrome.runtime.sendMessage({
            action: BackgroundActions.UPDATE_SETTINGS,
            ...patch
        });
    }

    getSetting(name) {
        return this.#settings[name];
    }
}
