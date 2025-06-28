export class LocalSettingsService<T extends object> {
    private _settings = $state({} as T);
    private storage = window.localStorage;

    constructor(private readonly key: string, defaultSettings: T) {
        this._settings = this.loadSettings() ?? defaultSettings;
    }

    get settings(): T {
        return this._settings;
    }

    updateSettings(newSettings: Partial<T>): void {
        this._settings = { ...this._settings, ...newSettings };
        this.saveSettings();
    }

    private loadSettings(): T | null {
        const json = this.storage.getItem(this.key);

        if (!json) {
            return null;
        }

        try {
            return JSON.parse(json) as T;
        } catch (error) {
            return null;
        }
    }

    private saveSettings(): void {
        const json = JSON.stringify(this._settings);
        this.storage.setItem(this.key, json);
    }
}
