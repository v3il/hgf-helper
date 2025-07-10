import { Firestore } from 'firebase-admin/firestore';
import { getDefaultSettings, ISettings } from './getDefaultSettings';

interface IUpdateUserPayload {
    hiddenOffers?: string[];
    settings?: ISettings;
}

export class UsersService {
    private db!: Firestore;

    setFirestore(db: Firestore) {
        this.db = db;
    }

    async get(userId: string) {
        const docRef = this.db.collection('users').doc(userId);
        const userSnap = await docRef.get();

        return userSnap.exists ? userSnap.data() : null;
    }

    async createIfNotExists(userId: string, userName: string) {
        const docRef = this.db.collection('users').doc(userId);
        const userSnap = await docRef.get();

        if (!userSnap.exists) {
            await docRef.set({
                userName,
                settings: getDefaultSettings(),
                hiddenOffers: []
            });
        }
    }

    async update(userId: string, payload: IUpdateUserPayload) {
        const docRef = this.db.collection('users').doc(userId);
        const normalizedPayload = this.normalizeUpdatePayload(payload);

        if (Object.keys(normalizedPayload).length) {
            await docRef.set(this.normalizeUpdatePayload(payload), { merge: true });
        }
    }

    private normalizeUpdatePayload(body: IUpdateUserPayload): Partial<IUpdateUserPayload> {
        const result: Partial<IUpdateUserPayload> = {};

        if (Array.isArray(body.hiddenOffers)) {
            result.hiddenOffers = body.hiddenOffers;
        }

        if (typeof body.settings === 'object' && body.settings !== null && !Array.isArray(body.settings)) {
            result.settings = body.settings;
        }

        return result;
    }
}
