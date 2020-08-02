import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';

// Optionally import the services that you want to use
//import "firebase/auth";
//import "firebase/database";
//import "firebase/functions";
//import "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDfC8W0GVdBPVkM4SY4eObORJfBmN1akmU',
  authDomain: 'with-pet-f1a0b.firebaseapp.com',
  databaseURL: 'https://with-pet-f1a0b.firebaseio.com',
  projectId: 'with-pet-f1a0b',
  storageBucket: 'with-pet-f1a0b.appspot.com',
  messagingSenderId: '958553891880',
  appId: '1:958553891880:web:331237679ca5cdf43bc11d',
  measurementId: 'G-B4QX99L8W8',
};

class Firebase {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    this._auth = firebase.auth();
    this._firestore = firebase.firestore();
  }

  auth() {
    return this._auth;
  }
  firestore() {
    return this._firestore;
  }
}
export default Firebase;
