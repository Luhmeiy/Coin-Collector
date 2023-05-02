export const ACTIONS = {
	CHANGE_THEME: "change-theme",
	ADD_USER: "add-user",
	ADD_USER_UID: "add-user-uid",
};

interface userData {
	email: string;
	displayName: string;
	photoURL: string;
}

export interface stateData {
	theme: string;
	userUID: string | null;
	user?: userData;
}

export interface actionData {
	type: string;
	payload: {
		theme?: string;
		user?: userData;
		userUID?: string;
	};
}

export const reducer = (state: stateData, action: actionData): stateData => {
	switch (action.type) {
		case ACTIONS.CHANGE_THEME:
			return { ...state, theme: action.payload.theme || state.theme };
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
	userUID: localStorage.getItem("userUID"),
};
