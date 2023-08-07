import { JSON_BIN_ACCESS_KEY, JSON_BIN_MASTER_KEY, JSON_BIN_URL } from '../storeConfig';

export class JsonBinApiService {
    getHiddenOffers() {
        return fetch(JSON_BIN_URL, {
            headers: this.#getHeaders()
        })
            .then((response) => response.json())
            .then((response) => response.record.offers)
            .catch((error) => {
                throw error;
            });
    }

    updateHiddenOffers(offers) {
        return fetch(JSON_BIN_URL, {
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
            'X-Master-Key': JSON_BIN_MASTER_KEY,
            'X-ACCESS_KEY': JSON_BIN_ACCESS_KEY
        };
    }
}
