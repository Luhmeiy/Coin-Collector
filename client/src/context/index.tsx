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
import { useGet } from "../hooks/useGet";

interface themeContextData {
	state: stateData;
	dispatch: Dispatch<actionData>;
}

interface userData {
	email: string;
	displayName: string;
	photoURL: string;
	mode: string;
	theme: string;
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

	const getData = useGet();
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
				try {
					const data = (await getData(`users/${uid}`)) as userData[];

					dispatch({
						type: ACTIONS.ADD_USER,
						payload: { user: data[0] },
					});

					dispatch({
						type: ACTIONS.CHANGE_MODE,
						payload: { mode: data[0].mode },
					});

					dispatch({
						type: ACTIONS.CHANGE_THEME,
						payload: { theme: data[0].theme },
					});

					document.documentElement.classList.add(
						data[0].mode.split("-")[0]
					);
				} catch (error) {
					navigate("/register");
				}
			};

			searchUsers(state.userUID);
		} else {
			navigate("/register");
		}
	}, [state.userUID, state.theme, state.mode]);

	return (
		<ThemeContext.Provider value={{ state, dispatch }}>
			{children}
		</ThemeContext.Provider>
	);
};
