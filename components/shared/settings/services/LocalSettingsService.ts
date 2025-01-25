import { log } from '@components/shared';

export interface ILocalSettings {
    hitsquad: boolean,
    hitsquadRounds: number,
    akiraDrawing: boolean
}

interface IParams {
    storage: Storage;
}

export class LocalSettingsService {
    static create() {
        return new LocalSettingsService({
            storage: window.localStorage
        });
    }

    private readonly storageKey = 'hgf-helper.settings';

    private readonly storage;

    private _settings: ILocalSettings = {
        hitsquad: false,
        hitsquadRounds: 0,
        akiraDrawing: false
    };

    constructor({ storage }: IParams) {
        this.storage = storage;
    }

    get settings() {
        return this._settings;
    }

    loadSettings() {
        const settings = this.storage.getItem(this.storageKey);

        log(`Local: ${settings}`);

        if (!settings) {
            return;
        }

        try {
            this._settings = { ...this._settings, ...JSON.parse(settings) };
        } catch (e) {
            console.error('Failed to parse settings', e);
        }
    }

    updateSettings(settings: Partial<ILocalSettings>) {
        this._settings = { ...this._settings, ...settings };
        this.storage.setItem(this.storageKey, JSON.stringify(this._settings));
    }
}
