import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: 'AIzaSyAM4Vznc2e8nxetzLfcJUMCkWHsiUS15LY',
    authDomain: 'hgf-helper.firebaseapp.com',
    projectId: 'hgf-helper',
    storageBucket: 'hgf-helper.firebasestorage.app',
    messagingSenderId: '452125133834',
    appId: '1:452125133834:web:3d2fdbe652dab36c0d23f3',
    measurementId: 'G-Z1Y6H5KF0J'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

if (process.env.FUNCTIONS_EMULATOR) {
    connectFirestoreEmulator(db, 'localhost', 8080);
}
