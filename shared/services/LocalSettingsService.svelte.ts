export class LocalSettingsService<T extends object> {
    private key!: string;
    private storage = window.localStorage;

    private _settings = $state({} as T);

    constructor(private readonly defaultSettings: T) {}

    get settings(): T {
        return this._settings;
    }

    loadSettings(key: string): void {
        this.key = key;
        this._settings = this.loadFromStorage() ?? this.defaultSettings;
    }

    updateSettings(newSettings: Partial<T>): void {
        this._settings = { ...this._settings, ...newSettings };
        this.saveSettings();
    }

    private loadFromStorage(): T | null {
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
