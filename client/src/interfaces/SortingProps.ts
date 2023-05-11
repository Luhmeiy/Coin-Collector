export interface SortSettingsProps {
	property: string;
	asc: boolean;
}

export type PropertyProps =
	| "name"
	| "year"
	| "quantity"
	| "value"
	| "initial_emission_date"
	| "final_emission_date";
