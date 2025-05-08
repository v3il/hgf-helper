import { Service } from 'typedi';
import { FUNCTION_URL } from '../consts';
import { ISettings, IUser } from './types';
import { UnauthenticatedError } from './UnauthenticatedError';

@Service()
export class FirebaseApiService {
    private token!: string;
    // private readonly debouncedSendUpdateRequest: DebouncedFunc<() => Promise<Response>>;
    // private changes!: Record<string, object | boolean>;

    // constructor() {
        // this.debouncedSendUpdateRequest = debounce(this.sendUpdateRequest.bind(this), 200);
    // }

    setToken(token: string) {
        this.token = token;
    }

    async getUser() {
        const response = await fetch(`${FUNCTION_URL}/user`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });

        if (!response.ok) {
            throw new UnauthenticatedError();
        }

        const json = await response.json();

        return json.user as IUser;
    }

    async updateSettings(settings: ISettings) {
        await this.sendUpdateRequest({ settings });
    }

    async updateHiddenOffers(hiddenOffers: string[]) {
        await this.sendUpdateRequest({ hiddenOffers });
    }

    async markSettingsMigrated() {
        await this.sendUpdateRequest({ settingsMigrated: true });
    }

    private async sendUpdateRequest(payload: object) {
        const response = await fetch(`${FUNCTION_URL}/user`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            return response;
        }

        if (response.status === 401) {
            throw new UnauthenticatedError();
        }
    }
}
