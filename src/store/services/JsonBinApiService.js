export class JsonBinApiService {
    #settingsService;

    constructor({ settingsService }) {
        this.#settingsService = settingsService;
    }

    getHiddenOffers() {
        const jsonBinUrl = this.#settingsService.getSetting('jsonBinUrl');

        return fetch(jsonBinUrl, { headers: this.#getHeaders() })
            .then((response) => response.json())
            .then((response) => response.record.offers)
            .catch((error) => {
                throw error;
            });
    }

    updateHiddenOffers(offers) {
        const jsonBinUrl = this.#settingsService.getSetting('jsonBinUrl');

        return fetch(jsonBinUrl, {
            headers: this.#getHeaders(),
            method: 'put',
            body: JSON.stringify({ offers })
        })
            .then(() => true)
            .catch((error) => {
                console.error(error);
                return false;
            });
    }

    #getHeaders() {
        const jsonBinMasterKey = this.#settingsService.getSetting('jsonBinMasterKey');
        const jsonBinAccessKey = this.#settingsService.getSetting('jsonBinAccessKey');

        return {
            'Content-Type': 'application/json',
            'X-Master-Key': jsonBinMasterKey,
            'X-ACCESS_KEY': jsonBinAccessKey
        };
    }
}
