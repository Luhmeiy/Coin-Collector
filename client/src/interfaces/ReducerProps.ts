import { UserData } from "./UserData";

export interface StateData {
	theme: string;
	mode: string;
	userUID: string | null;
	user?: UserData;
	serverURL?: string;
}

export interface ActionData {
	type: string;
	payload: {
		theme?: string;
		mode?: string;
		user?: UserData;
		userUID?: string;
	};
}
