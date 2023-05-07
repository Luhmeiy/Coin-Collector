import {
	Dispatch,
	ReactNode,
	Reducer,
	createContext,
	useEffect,
	useReducer,
} from "react";
import {
	reducer,
	initialState,
	stateData,
	actionData,
	ACTIONS,
} from "../utils/reducer";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";
import { useNavigate } from "react-router-dom";

interface themeContextData {
	state: stateData;
	dispatch: Dispatch<actionData>;
}

interface userData {
	email: string;
	displayName: string;
	photoURL: string;
}

interface fullConfigData {
	theme: any;
}

export const ThemeContext = createContext<themeContextData>({
	state: initialState,
	dispatch: () => null,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer<Reducer<stateData, actionData>>(
		reducer,
		initialState
	);

	const navigate = useNavigate();

	const fullConfig: fullConfigData = resolveConfig(tailwindConfig);

	document.documentElement.style.setProperty(
		"--color-gradient-primary",
		fullConfig.theme.colors[state.theme]
	);

	document.documentElement.style.setProperty(
		"--color-gradient-secondary",
		fullConfig.theme.colors[state.mode]
	);

	useEffect(() => {
		if (state.userUID) {
			const searchUsers = async (uid: string) => {
				await fetch(`${state.serverURL}/users/${uid}`)
					.then((response) => {
						return response.json();
					})
					.then((data: userData[]) => {
						if (data.length > 0) {
							dispatch({
								type: ACTIONS.ADD_USER,
								payload: { user: data[0] },
							});
						} else {
							navigate("/register");
						}
					})
					.catch(() => navigate("/register"));
			};

			searchUsers(state.userUID);
		} else {
			navigate("/register");
		}
	}, [state.userUID]);

	return (
		<ThemeContext.Provider value={{ state, dispatch }}>
			{children}
		</ThemeContext.Provider>
	);
};
