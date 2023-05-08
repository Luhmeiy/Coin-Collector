import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context";

export const useGet = (url: string) => {
	const { state } = useContext(ThemeContext);

	const [data, setData] = useState<any>();
	const [error, setError] = useState<string>();

	useEffect(() => {
		fetch(`${state.serverURL}/${url}`)
			.then((response) => response.json())
			.then(setData)
			.catch(setError);
	}, [url]);

	return { data, error };
};
