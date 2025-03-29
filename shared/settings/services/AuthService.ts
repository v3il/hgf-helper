import { ContainerInstance } from 'typedi';
import { IUser } from '@shared/settings';
import { AuthApiService } from './AuthApiService';

export class AuthService {
    private readonly storage;
    private readonly apiService: AuthApiService;

    private readonly storageKey = 'hgf-helper.settings';

    private _user: IUser | null = null;

    constructor(container: ContainerInstance) {
        this.apiService = container.get(AuthApiService);
        this.storage = chrome.storage.local;
    }

    get authUrl() {
        return this.apiService.AUTH_URL;
    }

    get user() {
        return this._user;
    }

    get isAuthenticated() {
        return !!this.user;
    }

    async auth() {
        const token = localStorage.getItem('hgf-token');

        if (!token) {
            return;
        }

        this._user = await this.apiService.getUser(token);

        console.error('User', this.user);
    }

    setToken(token: string) {
        localStorage.setItem('hgf-token', token);
    }
}
