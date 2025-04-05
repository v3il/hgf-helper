import { ContainerInstance } from 'typedi';
import { EventEmitter } from '@components/EventEmitter';
import { IUser } from '../types';
import { SettingsFacade } from '../settings';
import { FirebaseApiService } from '../FirebaseApiService';
import { HiddenOffersFacade } from '../hiddenOffers';

export class AuthService {
    private readonly apiService: FirebaseApiService;
    private readonly settingsFacade: SettingsFacade;
    private readonly hiddenOffersService: HiddenOffersFacade;

    private _user: IUser | null = null;
    private _isAuthenticated = false;
    readonly events = new EventEmitter<{
        authenticated: void;
        logout: void;
    }>();

    private readonly storageKey = 'hgf-helper.settings_v2u';
    private readonly storage = chrome.storage.local;

    constructor(container: ContainerInstance) {
        this.apiService = container.get(FirebaseApiService);
        this.settingsFacade = container.get(SettingsFacade);
        this.hiddenOffersService = container.get(HiddenOffersFacade);

        this.initObserver();
    }

    get userName() {
        return this._user?.userName ?? '';
    }

    get isAuthenticated() {
        return this._isAuthenticated;
    }

    async auth(token?: string) {
        const storageRecord = await this.storage.get([this.storageKey]);

        token ??= storageRecord[this.storageKey]?.token;

        if (!token) {
            return;
        }

        this.apiService.setToken(token);

        this._user = await this.apiService.getUser();
        this._isAuthenticated = true;

        await this.settingsFacade.setSettings(this._user!.settings);
        this.hiddenOffersService.setHiddenOffers(this._user!.hiddenOffers);

        await this.storage.set({ [this.storageKey]: { token } });

        console.error('User', this._user);
    }

    async logout() {
        this._user = null;
        await this.storage.remove([this.storageKey]);
    }

    private initObserver() {
        this.storage.onChanged.addListener((changes) => {
            if (!changes[this.storageKey]) return;

            const { newValue } = changes[this.storageKey];

            this._isAuthenticated = !!newValue;

            if (newValue) {
                this.events.emit('authenticated');
            } else {
                this.events.emit('logout');
            }
        });
    }
}
