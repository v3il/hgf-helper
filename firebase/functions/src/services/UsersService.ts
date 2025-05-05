import {
    doc, Firestore, getDoc, setDoc
} from 'firebase/firestore';
import { getDefaultSettings } from './getDefaultSettings';

export class UsersService {
    private readonly db: Firestore;

    constructor(db: Firestore) {
        this.db = db;
    }

    async get(userId: string) {
        const userSnap = await getDoc(doc(this.db, 'users', userId));

        return userSnap.exists() ? userSnap.data() : null;
    }

    async createIfNotExists(userId: string, userName: string) {
        const user = await this.get(userId);

        if (!user) {
            await setDoc(doc(this.db, 'users', userId), {
                userName,
                settings: getDefaultSettings(),
                hiddenOffers: []
            });
        }
    }

    async update(userId: string, payload: object) {
        return setDoc(doc(this.db, 'users', userId), this.normalizeUpdatePayload(payload), { merge: true });
    }

    private normalizeUpdatePayload(body: object) {
        return body; // todo
    }
}
