import { useContext } from "react";
import { ThemeContext } from "../context";

export const usePost = () => {
	const { state } = useContext(ThemeContext);

	const postData = async (url: string, data: object) => {
		await fetch(`${state.serverURL}/${url}`, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(data),
		});
	};

	return postData;
};
