import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyAARbUCylB5HXKJNkfkVoZ7VAwK_DjHDMY",
    authDomain: "apec-lanka-vehicles-2f741.firebaseapp.com",
    projectId: "apec-lanka-vehicles-2f741",
    storageBucket: "apec-lanka-vehicles-2f741.appspot.com",
    messagingSenderId: "871641286040",
    appId: "1:871641286040:web:4c01938c7229a6eb6197ed",
    measurementId: "G-0MYBRV4W5L"
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