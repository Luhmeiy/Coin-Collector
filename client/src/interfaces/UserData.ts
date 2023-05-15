export interface UserData {
	email: string;
	displayName: string;
	photoURL: string;
	mode: string;
	theme: string;
	coinSortSettings?: {
		asc: boolean;
		property: string;
	};
	presetSortSettings?: {
		asc: boolean;
		property: string;
	};
}
