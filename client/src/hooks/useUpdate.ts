import { useContext } from "react";
import { ThemeContext } from "../context";

export const useUpdate = () => {
	const { state } = useContext(ThemeContext);

	const updateData = async (url: string, data: object) => {
		const response = await fetch(`${state.serverURL}/${url}`, {
			method: "PUT",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error("Failed to update data.");
		}
	};

	return updateData;
};
