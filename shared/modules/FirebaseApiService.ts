import { Service } from 'typedi';
import { FUNCTION_URL } from '../consts';
import { ISettings, IUser } from './types';
import { UnauthorizedError } from './UnauthorizedError';

@Service()
export class FirebaseApiService {
    private token!: string;

    setToken(token: string) {
        this.token = token;
    }

    async getUser() {
        const response = await fetch(`${FUNCTION_URL}/user`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });

        const json = await response.json();

        return json.user as IUser;
    }

    async updateSettings(settings: ISettings) {
        await this.sendUpdateRequest({ settings });
    }

    async updateHiddenOffers(hiddenOffers: string[]) {
        await this.sendUpdateRequest({ hiddenOffers });
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
            throw new UnauthorizedError();
        }
    }
}
