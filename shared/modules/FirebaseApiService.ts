import { ContainerInstance, Service } from 'typedi';
import { FUNCTION_URL } from '../consts';
import { ISettings, IUser } from './types';
import { UnauthenticatedError } from './UnauthenticatedError';
import { RequestSender } from '@shared/modules/RequestSender';

@Service()
export class FirebaseApiService {
    private token!: string;
    private readonly extensionVersion!: string;

    private readonly requestSender: RequestSender;

    constructor(container: ContainerInstance) {
        this.requestSender = container.get(RequestSender);
        this.extensionVersion = this.getManifestVersion();
    }

    setToken(token: string) {
        this.token = token;
    }

    async getUser() {
        const response = await this.requestSender.sendRequest<{ user: IUser }>(`${FUNCTION_URL}/user`, {
            method: 'GET',
            headers: this.buildHeaders()
        });

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

    private async sendUpdateRequest(payload: object) {
        const response = await this.requestSender.sendRequest(`${FUNCTION_URL}/user`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
            headers: this.buildHeaders()
        });

        if (response.error?.status === 401 || response.error?.status === 404) {
            throw new UnauthenticatedError();
        }
    }

    private getManifestVersion(): string {
        const defaultVersion = '2.0.0';

        try {
            return chrome.runtime.getManifest().version;
        } catch (error) {
            return defaultVersion;
        }
    }

    private buildHeaders() {
        return {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            'HGF-Client-Version': this.extensionVersion
        };
    }
}
