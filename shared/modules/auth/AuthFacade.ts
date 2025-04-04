import { Container, Service } from 'typedi';
import { AuthService } from './AuthService';
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

    auth() {
        return this.authService.auth();
    }

    setToken(token: string) {
        console.error(token);
        return this.authService.setToken(token);
    }

    logout() {
        return this.authService.logout();
    }

    private initProviders() {
        this.container.set({ id: FirebaseApiService, type: FirebaseApiService });
        this.container.set({ id: AuthService, type: AuthService });
        this.container.set({ id: SettingsFacade, type: SettingsFacade });
        this.container.set({ id: HiddenOffersFacade, type: HiddenOffersFacade });
    }
}
