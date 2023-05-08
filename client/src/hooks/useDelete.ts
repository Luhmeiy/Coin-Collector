import { useContext } from "react";
import { ThemeContext } from "../context";

export const useDelete = () => {
	const { state } = useContext(ThemeContext);

	const deleteData = async (url: string) => {
		await fetch(`${state.serverURL}/${url}`, {
			method: "DELETE",
		});
	};

	return deleteData;
};
