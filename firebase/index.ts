// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyAM4Vznc2e8nxetzLfcJUMCkWHsiUS15LY',
    authDomain: 'hgf-helper.firebaseapp.com',
    projectId: 'hgf-helper',
    storageBucket: 'hgf-helper.firebasestorage.app',
    messagingSenderId: '452125133834',
    appId: '1:452125133834:web:3d2fdbe652dab36c0d23f3',
    measurementId: 'G-Z1Y6H5KF0J'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
