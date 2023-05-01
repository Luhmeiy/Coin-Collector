export const ACTIONS = {
	CHANGE_THEME: "change-theme",
};

export interface stateData {
	theme: string;
}

export interface actionData {
	type: string;
	payload: {
		theme: string;
	};
}

export const reducer = (state: stateData, action: actionData) => {
	switch (action.type) {
		case ACTIONS.CHANGE_THEME:
			return { theme: action.payload.theme };
		default:
			return state;
	}
};

export const initialState = {
	theme: "green-theme",
};
