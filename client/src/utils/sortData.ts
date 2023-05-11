import { PropertyProps, SortSettingsProps } from "../interfaces/SortingProps";

export function handleSortSettings(
	sortSettings: SortSettingsProps,
	property: PropertyProps
) {
	if (sortSettings.property === property) {
		const newSort = {
			...sortSettings,
			asc: !sortSettings.asc,
		};

		return newSort;
	} else {
		const newSort = {
			property,
			asc: true,
		};

		return newSort;
	}
}

export function sortData(
	data: any,
	sortSettings: SortSettingsProps,
	property: PropertyProps
) {
	const newSort = handleSortSettings(sortSettings, property);

	const sortedData = [...data].sort((a, b) => {
		const aValue = a[property];
		const bValue = b[property];

		if (typeof aValue === "number") {
			return newSort.asc ? +aValue - +bValue : +bValue - +aValue;
		} else {
			return newSort.asc
				? String(aValue).localeCompare(String(bValue))
				: String(bValue).localeCompare(String(aValue));
		}
	});

	return { newSort, sortedData };
}
