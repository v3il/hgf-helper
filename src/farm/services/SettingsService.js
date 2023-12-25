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
            this.#settings = await chrome.runtime.sendMessage({ action: 'LOAD_SETTINGS' });

            console.error(this.#settings);
        } catch (error) {
            console.error('Retry loadSettings');
            this.loadSettings();
        }
    }

    getSetting(name) {
        return this.#settings[name];
    }

    setSetting(name, value) {
        chrome.runtime.sendMessage({ action: 'UPDATE_SETTINGS', [name]: value });
    }
}
