import { Dispatch, ReactNode, createContext, useReducer } from "react";
import { reducer, initialState, stateData, actionData } from "../utils/reducer";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config.js";

interface themeContextData {
	state: stateData;
	dispatch: Dispatch<actionData>;
}

export const ThemeContext = createContext<themeContextData>({
	state: initialState,
	dispatch: () => null,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const fullConfig = resolveConfig(tailwindConfig);

	document.documentElement.style.setProperty(
		"--color-gradient-primary",
		fullConfig.theme.colors[state.theme]
	);

	return (
		<ThemeContext.Provider value={{ state, dispatch }}>
			{children}
		</ThemeContext.Provider>
	);
};
