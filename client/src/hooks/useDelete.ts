import { useContext } from "react";
import { ThemeContext } from "../context";

const useDelete = () => {
	const { state } = useContext(ThemeContext);

	const deleteData = async (url: string) => {
		const response = await fetch(`${state.serverURL}/${url}`, {
			method: "DELETE",
		});

		if (!response.ok) {
			throw new Error("Failed to delete data.");
		}
	};

	return deleteData;
};

export default useDelete;
