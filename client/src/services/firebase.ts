import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyA72OFXb3Om_bWiHNyOjZuwJLLOK1QVD40",
	authDomain: "coins-afc24.firebaseapp.com",
	databaseURL: "https://coins-afc24-default-rtdb.firebaseio.com",
	projectId: "coins-afc24",
	storageBucket: "coins-afc24.appspot.com",
	messagingSenderId: "422415631302",
	appId: "1:422415631302:web:e251c1fe7194f7e7f6e8c7",
	measurementId: "G-C4BWP7EDP0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
