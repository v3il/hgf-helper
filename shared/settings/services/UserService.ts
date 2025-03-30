import { ContainerInstance } from 'typedi';
import { ISettings, IUser } from '@shared/settings';
import { EventEmitter } from '@components/EventEmitter';
import { SettingsService } from '@shared/settings/services/SettingsService';
import { UserApiService } from './UserApiService';

export class UserService {
    private readonly apiService: UserApiService;
    private readonly settingsService: SettingsService;

    private _user: IUser | null = null;

    private readonly storageKey = 'hgf-helper.settings';
    private readonly storage = chrome.storage.local;

    constructor(container: ContainerInstance) {
        this.apiService = container.get(UserApiService);
        this.settingsService = container.get(SettingsService);
    }

    get user() {
        return this._user;
    }

    get isAuthenticated() {
        return !!this.user;
    }

    async auth() {
        const storageRecord = await this.storage.get([this.storageKey]);
        const { token } = storageRecord[this.storageKey] as { token: string };

        console.error('Token', token);

        if (!token) {
            return;
        }

        this.apiService.setToken(token);

        this._user = await this.apiService.getUser();
        await this.settingsService.setSettings(this._user.settings);

        console.error('User', this.user);
    }

    async setToken(token: string) {
        this.apiService.setToken(token);
        await this.storage.set({ [this.storageKey]: { token } });
    }
}
