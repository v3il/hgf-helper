import { GlobalSettingsService } from '@components/settings';
import { Container } from 'typedi';

export class JsonBinApiService {
    private readonly globalSettingsService;

    constructor() {
        this.globalSettingsService = Container.get(GlobalSettingsService);
    }

    private get jsonBinUrl() {
        return this.globalSettingsService.settings.jsonBinUrl;
    }

    async getHiddenOffers() {
        const response = await this.sendRequest();
        const { record } = await response.json();

        return record.offers;
    }

    updateHiddenOffers(offers: string[]) {
        return this.sendRequest({
            method: 'put',
            body: JSON.stringify({ offers })
        });
    }

    // eslint-disable-next-line no-undef
    private sendRequest(options: RequestInit = {}) {
        return fetch(this.jsonBinUrl, {
            headers: this.getHeaders(),
            ...options
        });
    }

    private getHeaders() {
        const { jsonBinMasterKey, jsonBinAccessKey } = this.globalSettingsService.settings;

        return {
            'Content-Type': 'application/json',
            'X-Master-Key': jsonBinMasterKey,
            'X-ACCESS_KEY': jsonBinAccessKey
        };
    }
}
