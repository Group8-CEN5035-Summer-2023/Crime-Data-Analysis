import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBlMgS9u6CiCsQKs46tHzrwloG1yEZJjbE",
  authDomain: "crimedataanalysis-bb752.firebaseapp.com",
  projectId: "crimedataanalysis-bb752",
  storageBucket: "crimedataanalysis-bb752.appspot.com",
  messagingSenderId: "817419581814",
  appId: "1:817419581814:web:28a7788c930c81a1e1a257",
  measurementId: "G-WBC8KV3EWD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default auth;
