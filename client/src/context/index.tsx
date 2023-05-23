// Hooks
import { useGet } from "../hooks";

// Interfaces
import { UserData } from "../interfaces/UserData";
import { ActionData, StateData } from "../interfaces/ReducerProps";

// React
import {
	Dispatch,
	ReactNode,
	Reducer,
	createContext,
	useEffect,
	useReducer,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { reducer, initialState, ACTIONS } from "../utils/reducer";

// Tailwind
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";

interface ThemeContextData {
	state: StateData;
	dispatch: Dispatch<ActionData>;
}

interface FullConfigData {
	theme: any;
}

export const ThemeContext = createContext<ThemeContextData>({
	state: initialState,
	dispatch: () => null,
});

const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer<Reducer<StateData, ActionData>>(
		reducer,
		initialState
	);

	const getData = useGet();
	const location = useLocation();
	const navigate = useNavigate();

	const fullConfig: FullConfigData = resolveConfig(tailwindConfig);

	document.documentElement.style.setProperty(
		"--color-gradient-primary",
		fullConfig.theme.colors[state.theme]
	);

	async function searchUsers(uid: string) {
		try {
			const data = (await getData(`users/${uid}`)) as UserData[];

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

			document.documentElement.classList.add(data[0].mode.split("-")[0]);
		} catch (error) {
			navigate("/register");
		}
	}

	useEffect(() => {
		if (state.userUID) {
			searchUsers(state.userUID);
		} else {
			if (!(location.pathname === "/register")) navigate("/login");
		}
	}, [state.userUID, state.theme, state.mode]);

	return (
		<ThemeContext.Provider value={{ state, dispatch }}>
			{children}
		</ThemeContext.Provider>
	);
};

export default ThemeProvider;
