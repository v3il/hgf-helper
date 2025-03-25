import {
    doc, Firestore, getDoc, setDoc
} from 'firebase/firestore';

export class UsersService {
    private readonly db: Firestore;

    constructor(db: Firestore) {
        this.db = db;
    }

    async get(userId: string) {
        const userSnap = await getDoc(doc(this.db, 'users', userId));

        return userSnap.exists() ? userSnap.data() : null;
    }

    async createIfNotExists(userId: string) {
        const user = await this.get(userId);

        if (!user) {
            await setDoc(doc(this.db, 'users', userId), {
                settings: { theme: 'dark', notifications: true },
                products: ['apple', 'banana']
            });
        }
    }
}
