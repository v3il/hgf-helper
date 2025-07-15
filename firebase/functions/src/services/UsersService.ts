import { Firestore, Timestamp } from 'firebase-admin/firestore';
import { firestore } from 'firebase-admin';
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

        if (!userSnap.exists) {
            return null;
        }

        const data = userSnap.data();

        if (!data) {
            return null;
        }

        await docRef.update({
            lastActiveAt: Timestamp.now()
        });

        return this.formatUserData(data);
    }

    private formatUserData(userSnap: firestore.DocumentData): firestore.DocumentData {
        const { userName, lastActiveAt, ...rest } = userSnap;

        return rest;
    }

    async createIfNotExists(userId: string, userName: string) {
        const docRef = this.db.collection('users').doc(userId);
        const userSnap = await docRef.get();

        if (!userSnap.exists) {
            await docRef.set({
                userName,
                settings: getDefaultSettings(),
                hiddenOffers: [],
                lastActiveAt: Timestamp.now()
            });
        }
    }

    async update(userId: string, payload: IUpdateUserPayload) {
        const docRef = this.db.collection('users').doc(userId);
        const userSnap = await docRef.get();

        if (!userSnap.exists) {
            return;
        }

        const normalizedPayload = this.normalizeUpdatePayload(payload);

        if (Object.keys(normalizedPayload).length) {
            await docRef.update({
                ...normalizedPayload,
                lastActiveAt: Timestamp.now()
            });
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
