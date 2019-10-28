import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDna74MVf-DhpL6f8TyKm7dXxaKE3HZEOQ",
  authDomain: "stox-75ce4.firebaseapp.com",
  databaseURL: "https://stox-75ce4.firebaseio.com",
  projectId: "stox-75ce4",
  storageBucket: "",
  messagingSenderId: "166538147073",
  appId: "1:166538147073:web:5cb20cd697b0d9d7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
