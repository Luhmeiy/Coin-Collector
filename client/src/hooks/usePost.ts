import { useContext } from "react";
import { ThemeContext } from "../context";

const usePost = () => {
	const { state } = useContext(ThemeContext);

	const postData = async (url: string, data: object) => {
		const response = await fetch(`${state.serverURL}/${url}`, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error("Failed to post data.");
		}
	};

	return postData;
};

export default usePost;
