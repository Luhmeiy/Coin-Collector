import { PresetData } from "./PresetData";

export interface PresetListingProps {
	filteredPresets?: PresetData[];
	handleDeletePreset(coinId: string): Promise<void>;
}
