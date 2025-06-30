import { Container, Service } from 'typedi';
import { AuthService } from './AuthService.svelte';
import { SettingsFacade } from '../settings';
import { HiddenOffersFacade } from '../hiddenOffers';
import { FirebaseApiService } from '../FirebaseApiService';
import { StorageService } from '../StorageService';
import { EventHandler } from '@shared/EventEmitter';

@Service()
export class AuthFacade {
    private authService!: AuthService;

    private container = Container.of('auth');

    constructor() {
        this.initProviders();
    }

    get isAuthenticated() {
        return this.authService.isAuthenticated;
    }

    auth(token?: string) {
        return this.authService.auth(token);
    }

    logout() {
        return this.authService.logout();
    }

    onLogin(handler: EventHandler) {
        return this.authService.onLogin(handler);
    }

    onLogout(handler: EventHandler) {
        return this.authService.onLogout(handler);
    }

    private initProviders() {
        this.container.set({ id: StorageService, value: Container.get(StorageService) });
        this.container.set({ id: FirebaseApiService, value: Container.get(FirebaseApiService) });
        this.container.set({ id: AuthService, type: AuthService });
        this.container.set({ id: SettingsFacade, value: Container.get(SettingsFacade) });
        this.container.set({ id: HiddenOffersFacade, value: Container.get(HiddenOffersFacade) });

        this.authService = this.container.get(AuthService);
    }
}
