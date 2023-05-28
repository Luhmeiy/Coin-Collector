export interface CoinData {
	name: string;
	symbol: string;
	value: number;
	year: number;
	quantity: number;
	note?: string;
}

export interface CompleteCoinData extends CoinData {
	id: string;
}
