import { JSON_BIN_ACCESS_KEY, JSON_BIN_MASTER_KEY } from '../storeConfig';

const BIN_URL = 'https://api.jsonbin.io/v3/b/641a25fcebd26539d092d042';

export class JsonBinApiService {
    getHiddenOffers() {
        return fetch(BIN_URL, {
            headers: this.#getHeaders()
        })
            .then((response) => response.json())
            .then((response) => response.record.offers)
            .catch((error) => {
                console.error(error);
                return [];
            });
    }

    updateHiddenOffers(offers) {
        return fetch(BIN_URL, {
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
