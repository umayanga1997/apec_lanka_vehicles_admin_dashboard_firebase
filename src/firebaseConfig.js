import firebase from 'firebase';

// const firebaseConfig = {
//     apiKey: "AIzaSyAARbUCylB5HXKJNkfkVoZ7VAwK_DjHDMY",
//     authDomain: "apec-lanka-vehicles-2f741.firebaseapp.com",
//     projectId: "apec-lanka-vehicles-2f741",
//     storageBucket: "apec-lanka-vehicles-2f741.appspot.com",
//     messagingSenderId: "871641286040",
//     appId: "1:871641286040:web:4c01938c7229a6eb6197ed",
//     measurementId: "G-0MYBRV4W5L"
// };
const firebaseConfig = {
    apiKey: "AIzaSyD0MhUoyirZtJHHXZT_l8MXn2X00GgO1Xg",
    // authDomain: "apec-lanka-vehicles-production.firebaseapp.com",
    authDomain: "vehicles.apeclanka.lk",
    projectId: "apec-lanka-vehicles-production",
    storageBucket: "apec-lanka-vehicles-production.appspot.com",
    messagingSenderId: "172735854809",
    appId: "1:172735854809:web:9a7f9940c3bbad81a826c8",
    measurementId: "G-LYGPL31631"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
firebaseApp.firestore().settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
});
firebaseApp.firestore().enablePersistence({ synchronizeTabs: true }).catch((err) => {
    if (err.code == 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
        // ...
    } else if (err.code == 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
        // ...
    }
});
const fireStore = firebaseApp.firestore();
const storage = firebaseApp.storage();
const auth = firebase.auth();
// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
// auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export {
    fireStore,
    storage,
    firebase,
    auth,
    googleAuthProvider,
};