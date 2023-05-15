import { useContext } from "react";
import { ThemeContext } from "../context";

const useGet = () => {
	const { state } = useContext(ThemeContext);

	const getData = async (url: string) => {
		const response = await fetch(`${state.serverURL}/${url}`);

		if (!response.ok) {
			throw new Error("Failed to fetch data.");
		}

		return response.json();
	};

	return getData;
};

export default useGet;
