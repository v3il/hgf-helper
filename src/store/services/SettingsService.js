export class SettingsService {
    static create() {
        return new SettingsService();
    }

    #settings = {};

    async loadSettings() {
        this.#settings = await chrome.runtime.sendMessage({ action: 'LOAD_SETTINGS' });
    }

    getSetting(name) {
        return this.#settings[name];
    }
}
