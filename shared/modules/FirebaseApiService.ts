import { Service } from 'typedi';
import { FUNCTION_URL } from '../consts';
import { ISettings, IUser } from './types';
import { UnauthenticatedError } from './UnauthenticatedError';

interface ISendRequestError {
    status: number;
    error: string;
}

interface ISendRequestResponse<D> {
    data?: D;
    error?: ISendRequestError;
}

@Service()
export class FirebaseApiService {
    private token!: string;

    setToken(token: string) {
        this.token = token;
    }

    async getUser() {
        const response = await this.sendRequest<{ user: IUser }>(`${FUNCTION_URL}/user`);

        if (response.error) {
            throw new UnauthenticatedError();
        }

        return response.data!.user;
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
        const response = await this.sendRequest(`${FUNCTION_URL}/user`, {
            method: 'PATCH',
            body: JSON.stringify(payload)
        });

        if (response.error?.status === 401 || response.error?.status === 404) {
            throw new UnauthenticatedError();
        }
    }

    private sendRequest<R extends object = object>(url: string, requestInit: Partial<RequestInit> = {}): Promise<ISendRequestResponse<R>> {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({
                type: 'sendRequest',
                url,
                requestInit: {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    },
                    ...requestInit
                }
            }, resolve);
        });

    }
}
