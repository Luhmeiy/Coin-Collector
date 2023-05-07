import { useContext } from "react";
import { ThemeContext } from "../context";

export const useUpdateUser = () => {
	const { state } = useContext(ThemeContext);

	const updateUser = async (data: object) => {
		await fetch(`${state.serverURL}/users/${state.userUID}`, {
			method: "PUT",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(data),
		});
	};

	return updateUser;
};
