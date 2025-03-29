import { Container, Service } from 'typedi';
import { AuthService, AuthApiService } from './services';
import { LocalSettingsService } from './LocalSettingsService';

@Service()
export class AuthFacade {
    private authService!: AuthService;
    private localSettingsService!: LocalSettingsService;

    private container = Container.of('auth');

    constructor() {
        this.initProviders();
    }

    get authUrl() {
        return this.authService.authUrl;
    }

    get isAuthenticated() {
        return this.authService.isAuthenticated;
    }

    get user() {
        return this.authService.user;
    }

    auth() {
        return this.authService.auth();
    }

    setToken(token: string) {
        this.authService.setToken(token);
    }

    private initProviders() {
        this.container.set({ id: AuthService, type: AuthService });
        this.container.set({ id: AuthApiService, type: AuthApiService });
        this.container.set({ id: LocalSettingsService, value: LocalSettingsService.create() });

        this.authService = this.container.get(AuthService);
        this.localSettingsService = this.container.get(LocalSettingsService);
    }
}
