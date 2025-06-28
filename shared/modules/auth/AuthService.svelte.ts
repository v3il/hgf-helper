import { ContainerInstance } from 'typedi';
import { IUser } from '../types';
import { SettingsFacade } from '../settings';
import { FirebaseApiService } from '../FirebaseApiService';
import { HiddenOffersFacade } from '../hiddenOffers';
import { StorageService } from '../StorageService';

export class AuthService {
    private readonly apiService: FirebaseApiService;
    private readonly settingsFacade: SettingsFacade;
    private readonly hiddenOffersService: HiddenOffersFacade;
    private readonly storageService: StorageService;

    private _user: IUser | null = $state(null);
    private _isAuthenticated = $state(false);

    constructor(container: ContainerInstance) {
        this.storageService = container.get(StorageService);
        this.apiService = container.get(FirebaseApiService);
        this.settingsFacade = container.get(SettingsFacade);
        this.hiddenOffersService = container.get(HiddenOffersFacade);

        this.initObserver();
    }

    get isAuthenticated() {
        return this._isAuthenticated;
    }

    async auth(token?: string) {
        token ??= await this.storageService.getAuthToken();

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

        await this.storageService.updateData({ token });

        console.log('User', this._user);
    }

    async logout() {
        this._user = null;
        await this.storageService.updateData({ token: '' });
    }

    private initObserver() {
        this.storageService.onDataChanged(async () => {
            const token = await this.storageService.getAuthToken();

            this._isAuthenticated = !!token;

            if (token) {
                this.apiService.setToken(token);
            }
        });
    }
}
