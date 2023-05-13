import { db } from "../config/db";
import {
	DocumentData,
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore";

interface userData {
	email: string;
	displayName: string;
	photoURL: string;
}

interface coinData {
	name: string;
	symbol: string;
	value: number;
	year: number;
	quantity: number;
}

export const getData = async (
	path: string,
	order?: string,
	direction?: "asc" | "desc",
	id?: string
) => {
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
		const q = query(dbRef, orderBy(order!, direction!));
		const docsSnap = await getDocs(q);

		docsSnap.forEach((doc) => {
			data.push({ ...doc.data(), id: doc.id });
		});
	}

	return data;
};

export const postData = async (path: string, data: {}) => {
	const dbRef = collection(db, path);

	addDoc(dbRef, data)
		.then((docRef) => {
			return docRef;
		})
		.catch((error) => {
			return error;
		});
};

export const deleteData = async (path: string, id: string) => {
	const docRef = doc(db, path, id);

	deleteDoc(docRef)
		.then(() => {
			console.log("Document deleted successfully");
		})
		.catch((error) => {
			console.log(error);
		});
};

export const updateData = async (path: string, id: string, data: {}) => {
	const docRef = doc(db, path, id);

	await updateDoc(docRef, data)
		.then(() => {
			console.log("Document updated successfully");
		})
		.catch((error) => {
			console.log(error);
		});
};

export const registerUser = async (
	path: string,
	data: userData,
	uid: string
) => {
	const dbRef = doc(db, path, uid);

	const { email, displayName, photoURL } = data;

	const defaultOrder = {
		property: "name",
		asc: true,
	};

	const userData = {
		email,
		displayName,
		photoURL,
		theme: "green-theme",
		mode: "light-mode",
		coinSortSettings: defaultOrder,
		presetSortSettings: defaultOrder,
	};

	setDoc(dbRef, userData)
		.then((docRef) => {
			return docRef;
		})
		.catch((error) => {
			return error;
		});
};

export const verifyIfCoinExists = async (path: string, data: coinData) => {
	const results: DocumentData = [];

	const dbRef = collection(db, path);
	const q = query(
		dbRef,
		where("name", "==", data.name),
		where("symbol", "==", data.symbol),
		where("value", "==", data.value),
		where("year", "==", data.year)
	);
	const docsSnap = await getDocs(q);

	docsSnap.forEach((doc) => {
		results.push({ id: doc.id, ...doc.data() });
	});

	return results;
};
