import { Container, Service } from 'typedi';
import { EventHandler } from '@components/EventEmitter';
import { GlobalSettingsKeys, ISettings, ISettingsEvents } from './types';
import { SettingsService, UserApiService, UserService, HiddenOffersService } from './services';

@Service()
export class UserFacade {
    private userService!: UserService;
    private settingsService!: SettingsService;
    private hiddenOffersService!: HiddenOffersService;

    private container = Container.of('auth');

    constructor() {
        this.initProviders();
    }

    get isAuthenticated() {
        return this.userService.isAuthenticated;
    }

    get userName() {
        return this.userService.userName;
    }

    get settings() {
        return this.settingsService.settings;
    }

    auth() {
        return this.userService.auth();
    }

    setToken(token: string) {
        console.error(token);
        return this.userService.setToken(token);
    }

    updateSettings(settings: Partial<ISettings>) {
        return this.settingsService.updateSettings(settings);
    }

    onSettingChanged<
        K extends GlobalSettingsKeys
    >(key: K, callback: EventHandler<ISettingsEvents[`setting-changed:${K}`]>) {
        this.settingsService.events.on(`setting-changed:${key}`, callback);
    }

    private initProviders() {
        this.container.set({ id: SettingsService, type: SettingsService });
        this.container.set({ id: UserService, type: UserService });
        this.container.set({ id: UserApiService, type: UserApiService });
        this.container.set({ id: HiddenOffersService, type: HiddenOffersService });

        this.settingsService = this.container.get(SettingsService);
        this.userService = this.container.get(UserService);
        this.hiddenOffersService = this.container.get(HiddenOffersService);
    }

    logout() {
        return this.userService.logout();
    }
}
