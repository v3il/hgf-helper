import { ContainerInstance } from 'typedi';
import { EventEmitter } from '@shared/EventEmitter';
import { IUser } from '../types';
import { SettingsFacade } from '../settings';
import { FirebaseApiService } from '../FirebaseApiService';
import { HiddenOffersFacade } from '../hiddenOffers';

export class AuthService {
    private readonly apiService: FirebaseApiService;
    private readonly settingsFacade: SettingsFacade;
    private readonly hiddenOffersService: HiddenOffersFacade;

    private _user: IUser | null = $state(null);
    private _isAuthenticated = $state(false);
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

        if (!this._user.settingsMigrated) {
            await this.settingsFacade.migrateOldSettings();
        }

        await this.storage.set({ [this.storageKey]: { token } });

        $inspect('User', this._user);
    }

    async logout() {
        this._user = null;

        await this.settingsFacade.updateSettings({
            chestGame: false,
            lootGame: false,
            hitsquad: false,
            hitsquadRounds: 0
        })

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
