import { ActionData, StateData } from "../interfaces/ReducerProps";

export const ACTIONS = {
	CHANGE_THEME: "change-theme",
	CHANGE_MODE: "change-mode",
	ADD_USER: "add-user",
	ADD_USER_UID: "add-user-uid",
};

export const reducer = (state: StateData, action: ActionData): StateData => {
	switch (action.type) {
		case ACTIONS.CHANGE_THEME:
			return { ...state, theme: action.payload.theme || state.theme };
		case ACTIONS.CHANGE_MODE:
			return { ...state, mode: action.payload.mode || state.mode };
		case ACTIONS.ADD_USER:
			return { ...state, user: action.payload.user };
		case ACTIONS.ADD_USER_UID:
			return {
				...state,
				userUID: action.payload.userUID || state.userUID,
			};
		default:
			return state;
	}
};

export const initialState = {
	theme: "green-theme",
	mode: "light-mode",
	userUID: localStorage.getItem("userUID"),
	serverURL: import.meta.env.VITE_SERVER_URL,
};
