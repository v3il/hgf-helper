import { getFirestore } from 'firebase-admin/firestore';

export function initFirestore() {
    const db = getFirestore();

    if (process.env.FUNCTIONS_EMULATOR) {
        db.settings({
            host: 'localhost:8080',
            ssl: false
        });
    }

    return db;
}
