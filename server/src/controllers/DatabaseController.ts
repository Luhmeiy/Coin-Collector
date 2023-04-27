import { db } from "../config/db";
import {
	DocumentData,
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
} from "firebase/firestore";

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
