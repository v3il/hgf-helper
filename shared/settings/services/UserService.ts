import { ContainerInstance } from 'typedi';
import { IUser } from '../types';
import { SettingsService } from './SettingsService';
import { UserApiService } from './UserApiService';
import { HiddenOffersService } from './HiddenOffersService';

export class UserService {
    private readonly apiService: UserApiService;
    private readonly settingsService: SettingsService;
    private readonly hiddenOffersService: HiddenOffersService;

    private _user: IUser | null = null;

    private readonly storageKey = 'hgf-helper.settings_v2u';
    private readonly storage = chrome.storage.local;

    constructor(container: ContainerInstance) {
        this.apiService = container.get(UserApiService);
        this.settingsService = container.get(SettingsService);
        this.hiddenOffersService = container.get(HiddenOffersService);
    }

    get userName() {
        return this._user?.userName ?? '';
    }

    get isAuthenticated() {
        return !!this._user;
    }

    async auth() {
        const storageRecord = await this.storage.get([this.storageKey]);
        const { token } = storageRecord[this.storageKey] ?? { token: '' } as { token: string };

        if (!token) {
            return;
        }

        this.apiService.setToken(token);

        this._user = await this.apiService.getUser();
        await this.settingsService.setSettings(this._user!.settings);
        this.hiddenOffersService.setHiddenOffers(this._user!.hiddenOffers);

        console.error('User', this._user);
    }

    async setToken(token: string) {
        this.apiService.setToken(token);
        await this.storage.set({ [this.storageKey]: { token } });
    }

    async logout() {
        this._user = null;
        await this.storage.remove([this.storageKey]);
    }
}
