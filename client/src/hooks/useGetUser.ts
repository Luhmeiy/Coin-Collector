import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface userData {
	email: string;
	displayName: string;
	photoURL: string;
}

export const useGetUser = () => {
	const [user, setUser] = useState<userData>();

	const userUID = localStorage.getItem("userUID");

	const navigate = useNavigate();

	async function searchUsers(uid: string) {
		await fetch(`https://coin-collector-server.vercel.app/users/${uid}`)
			.then((response) => {
				return response.json();
			})
			.then((data: userData[]) => {
				if (data.length > 0) {
					setUser(data[0]);
				} else {
					navigate("/register");
				}
			});
	}

	if (userUID) {
		searchUsers(userUID);

		return user;
	} else {
		navigate("/register");
	}
};
