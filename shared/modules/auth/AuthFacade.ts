import { Container, Service } from 'typedi';
import { AuthService } from './AuthService.svelte';
import { SettingsFacade } from '../settings';
import { HiddenOffersFacade } from '../hiddenOffers';
import { FirebaseApiService } from '../FirebaseApiService';

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

    get userName() {
        return this.authService.userName;
    }

    auth(token?: string) {
        return this.authService.auth(token);
    }

    logout() {
        return this.authService.logout();
    }

    onAuthenticated(callback: () => void) {
        this.authService.events.on('authenticated', callback);
    }

    onLogout(callback: () => void) {
        this.authService.events.on('logout', callback);
    }

    private initProviders() {
        this.container.set({ id: FirebaseApiService, value: Container.get(FirebaseApiService) });
        this.container.set({ id: AuthService, type: AuthService });
        this.container.set({ id: SettingsFacade, value: Container.get(SettingsFacade) });
        this.container.set({ id: HiddenOffersFacade, value: Container.get(HiddenOffersFacade) });

        this.authService = this.container.get(AuthService);
    }
}
