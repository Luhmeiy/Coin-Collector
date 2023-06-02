import { CompleteCoinData } from "./CoinData";

export interface CoinListingProps {
	filteredCoins?: CompleteCoinData[];
	handleUpdateQuantity(
		id: string,
		index: number,
		action: "ADD" | "SUBTRACT"
	): Promise<void>;
	handleDeleteCoin(coinId: string): Promise<void>;
}
