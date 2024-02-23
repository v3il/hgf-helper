export class JsonBinApiService {
    #jsonBinUrl;
    #jsonBinMasterKey;
    #jsonBinAccessKey;

    constructor({ jsonBinUrl, jsonBinMasterKey, jsonBinAccessKey }) {
        this.#jsonBinUrl = jsonBinUrl;
        this.#jsonBinMasterKey = jsonBinMasterKey;
        this.#jsonBinAccessKey = jsonBinAccessKey;
    }

    getHiddenOffers() {
        return fetch(this.#jsonBinUrl, { headers: this.#getHeaders() })
            .then((response) => response.json())
            .then((response) => response.record.offers)
            .catch((error) => {
                throw error;
            });
    }

    updateHiddenOffers(offers) {
        return fetch(this.#jsonBinUrl, {
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
        return {
            'Content-Type': 'application/json',
            'X-Master-Key': this.#jsonBinMasterKey,
            'X-ACCESS_KEY': this.#jsonBinAccessKey
        };
    }
}
