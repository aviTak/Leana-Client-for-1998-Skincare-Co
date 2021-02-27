import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/firebase-storage';
import 'firebase/firebase-auth';

const firebaseConfig = {
    apiKey: "AIzaSyAMKNycQLmqEEXqCBb07Gs5dwY3zjGehME",
    authDomain: "skincareco1998.firebaseapp.com",
    databaseURL: "https://skincareco1998.firebaseio.com",
    projectId: "skincareco1998",
    storageBucket: "skincareco1998.appspot.com",
    messagingSenderId: "362652084784",
    appId: "1:362652084784:web:8fa43ce71b938f929f9bf5",
    measurementId: "G-9HNE29LYDP"
};
  
firebase.initializeApp(firebaseConfig);
// firebase.analytics();