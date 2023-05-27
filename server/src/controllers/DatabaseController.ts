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

interface UserData {
	email: string;
	displayName: string;
	photoURL: string;
	password?: string;
}

interface FullUserData extends UserData {
	theme: string;
	mode: string;
	coinSortSettings: {};
	presetSortSettings: {};
}

interface CoinData {
	name: string;
	symbol: string;
	value: number;
	year: number;
	quantity: number;
	note?: string;
}

export const getData = async (
	path: string,
	order: string,
	direction: "asc" | "desc",
	id?: string
) => {
	let data: DocumentData[] = [];

	try {
		if (id) {
			const docRef = doc(db, path, id);
			const docSnap = await getDoc(docRef);

			const document = docSnap.data();

			if (document) data.push(document);
		} else {
			const dbRef = collection(db, path);
			const q = query(dbRef, orderBy(order, direction));
			const docsSnap = await getDocs(q);

			docsSnap.forEach((doc) => {
				data.push({ ...doc.data(), id: doc.id });
			});
		}

		if (data.length > 0) return data;

		throw new Error("Failed to fetch data.");
	} catch (error) {
		throw new Error(error.message);
	}
};

export const postData = async (path: string, data: object) => {
	const dbRef = collection(db, path);

	try {
		await addDoc(dbRef, data);
		console.log("Document posted successfully");
	} catch (error) {
		throw new Error(error.message);
	}
};

export const updateData = async (path: string, id: string, data: object) => {
	const docRef = doc(db, path, id);

	try {
		await updateDoc(docRef, data);
		console.log("Document updated successfully");
	} catch (error) {
		throw new Error(error.message);
	}
};

export const deleteData = async (path: string, id: string) => {
	const docRef = doc(db, path, id);

	const docSnapshot = await getDoc(docRef);

	if (docSnapshot.exists()) {
		await deleteDoc(docRef);
		console.log("Document deleted successfully");
	} else {
		throw new Error("Document does not exist");
	}
};

export const registerUser = async (
	path: string,
	uid: string,
	data: UserData
) => {
	const docRef = doc(db, path, uid);

	const { email, displayName, photoURL, password } = data;

	const defaultOrder = {
		property: "name",
		asc: true,
	};

	const userData: FullUserData = {
		email,
		displayName,
		photoURL,
		theme: "green-theme",
		mode: "light-mode",
		coinSortSettings: defaultOrder,
		presetSortSettings: defaultOrder,
	};

	if (password) {
		userData.password = password;
	}

	try {
		await setDoc(docRef, userData);
		console.log("User registered successfully");
	} catch (error) {
		throw new Error(error.message);
	}
};

export const verifyIfCoinExists = async (path: string, data: CoinData) => {
	const results: DocumentData = [];

	const queryParams = [
		where("name", "==", data.name),
		where("symbol", "==", data.symbol),
		where("value", "==", data.value),
		where("year", "==", data.year),
	];

	if (data.note) {
		queryParams.push(where("note", "==", data.note));
	}

	const dbRef = collection(db, path);
	const q = query(dbRef, ...queryParams);

	try {
		const docsSnap = await getDocs(q);

		docsSnap.forEach((doc) => {
			results.push({ id: doc.id, ...doc.data() });
		});

		return results;
	} catch (error) {
		throw new Error(error.message);
	}
};
