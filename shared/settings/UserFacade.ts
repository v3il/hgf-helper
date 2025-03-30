import { Container, Service } from 'typedi';
import { ISettings } from '@shared/settings/types';
import { EventHandler } from '@components/EventEmitter';
import { UserService, UserApiService, GlobalSettingsKeys, ISettingsEvents } from './services';

@Service()
export class UserFacade {
    private authService!: UserService;

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

    get settings() {
        return this.authService.settings;
    }

    auth() {
        return this.authService.auth();
    }

    setToken(token: string) {
        this.authService.setToken(token);
    }

    updateSettings(settings: Partial<any>) {
        return this.authService.updateSettings(settings);
    }

    onSettingChanged<
        K extends GlobalSettingsKeys
    >(key: K, callback: EventHandler<ISettingsEvents[`setting-changed:${K}`]>) {
        this.authService.events.on(`setting-changed:${key}`, callback);
    }

    private initProviders() {
        this.container.set({ id: UserService, type: UserService });
        this.container.set({ id: UserApiService, type: UserApiService });
        // this.container.set({ id: SettingsService, type: SettingsService });

        this.authService = this.container.get(UserService);
        // this.settingsService = this.container.get(SettingsService);
    }
}
