import { initializeApp } from "firebase/app";
import {
	DocumentData,
	collection,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	orderBy,
	query,
} from "firebase/firestore";

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
const db = getFirestore(app);

export const getData = async (path: string, order?: string, id?: string) => {
	let data: DocumentData[] = [];

	if (id) {
		const docRef = doc(db, path, id);
		const docSnap = await getDoc(docRef);

		const document = docSnap.data();

		if (document) {
			data.push(document);
		}
	} else {
		const dbRef = collection(db, path);
		const q = query(dbRef, orderBy(order!));
		const docsSnap = await getDocs(q);

		docsSnap.forEach((doc) => {
			data.push(doc.data());
		});
	}

	return data;
};
