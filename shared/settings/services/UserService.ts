import { ContainerInstance } from 'typedi';
import { ISettings, IUser } from '@shared/settings';
import { EventEmitter } from '@components/EventEmitter';
import { UserApiService } from './UserApiService';

export type GlobalSettingsKeys = keyof ISettings;

export type ISettingsEvents = {
    [K in keyof ISettings as `setting-changed:${K}`]: ISettings[K];
};

export class UserService {
    private readonly apiService: UserApiService;

    private token: string;
    private _user: IUser | null = null;

    readonly events = EventEmitter.create<ISettingsEvents>();

    constructor(container: ContainerInstance) {
        this.apiService = container.get(UserApiService);
        this.token = localStorage.getItem('hgf-token') || '';
    }

    get authUrl() {
        return this.apiService.AUTH_URL;
    }

    get user() {
        return this._user;
    }

    get isAuthenticated() {
        return !!this.user;
    }

    async auth() {
        console.error(this.token);

        if (!this.token) {
            return;
        }

        this._user = await this.apiService.getUser(this.token);
        this._user.settings = { ...this.getDefaultSettings(), ...this._user.settings };

        console.error('User', this.user);
    }

    setToken(token: string) {
        this.token = token;
        // localStorage.setItem('hgf-token', token);
    }

    get settings() {
        return this._user!.settings;
    }

    async updateSettings(settings: Partial<ISettings>) {
        this._user!.settings = { ...this._user!.settings, ...settings };
        await this.apiService.updateSettings(this.token, this._user!.settings);

        Object.keys(settings).forEach((settingName) => {
            const key = settingName as GlobalSettingsKeys;
            this.events.emit(`setting-changed:${key as GlobalSettingsKeys}`, settings[key]);
        });
    }

    private getDefaultSettings() {
        return {
            // Mini-games
            hitsquad: false,
            hitsquadRounds: 0,
            akiraDrawing: false,
            chestGame: false,
            lootGame: false,

            // Twitch
            highlightMentions: true,
            collectDaCoinz: true,
            decreaseStreamDelay: true,

            // Store
            offersMaxPrice: 999_999,
            hideSoldOutOffers: true,
            highlightLowVolumeOffers: true,
            sortOffersBy: '\'order\'',
            enhanceStoreHeader: true,
            enhanceStoreSidebar: true,
            hideStoreFooter: true,

            // Misc
            openAiApiToken: ''
        };
    }
}
