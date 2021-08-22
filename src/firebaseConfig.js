import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyD0MhUoyirZtJHHXZT_l8MXn2X00GgO1Xg",
    authDomain: "apec-lanka-vehicles-production.firebaseapp.com",
    projectId: "apec-lanka-vehicles-production",
    storageBucket: "apec-lanka-vehicles-production.appspot.com",
    messagingSenderId: "172735854809",
    appId: "1:172735854809:web:9a7f9940c3bbad81a826c8",
    measurementId: "G-LYGPL31631"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
firebaseApp.firestore().settings({
    timestampsInSnapshots: true,
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
});
firebaseApp.firestore().enablePersistence();
const fireStore = firebaseApp.firestore();
const storage = firebaseApp.storage();
export {
    fireStore,
    storage,
    firebase,
};