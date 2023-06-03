// Interfaces
import { CoinListingProps } from "../../interfaces/CoinListingProps";

// Libraries
import * as Popover from "@radix-ui/react-popover";
import { PencilSimple, Trash } from "@phosphor-icons/react";

// React
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context";

const CoinBlocks = ({ filteredCoins, handleDeleteCoin }: CoinListingProps) => {
	const { state } = useContext(ThemeContext);

	const navigate = useNavigate();

	return (
		<div
			className={`grid h-full auto-rows-max grid-cols-3 gap-3 overflow-y-auto bg-${state.theme} p-4 pt-10 max-form:grid-cols-2 tablet:hidden`}
		>
			{filteredCoins &&
				filteredCoins.map((coin) => (
					<div
						key={coin.id}
						className="input flex h-auto flex-col bg-light-mode px-3 py-2 dark:bg-dark-mode"
					>
						<p>
							<span className="font-semibold">{coin.name}</span> (
							{coin.year})
						</p>
						<p>
							{coin.symbol} {coin.value.toFixed(2)}
						</p>
						<p>
							<span className="font-semibold">Quantity: </span>
							{coin.quantity}
						</p>

						<div className="relative">
							{coin.note && (
								<Popover.Root>
									<Popover.Trigger asChild>
										<p className="inline cursor-pointer font-semibold">
											Note<sup>*</sup>
										</p>
									</Popover.Trigger>
									<Popover.Portal>
										<Popover.Content
											className="input z-20 max-w-[18.75rem] bg-light-mode p-3 dark:bg-dark-mode dark:text-gray-100 max-form:max-w-[12.5rem]"
											side="right"
											sideOffset={6}
										>
											<span className="font-semibold">
												Note:{" "}
											</span>
											{coin.note}

											<Popover.Arrow className="fill-black" />
										</Popover.Content>
									</Popover.Portal>
								</Popover.Root>
							)}
						</div>

						<div className="mt-3 flex flex-1 items-end justify-center gap-2">
							<button
								className="input flex max-w-[4.5rem] justify-center bg-gray-300 py-2 font-semibold text-gray-800 hover:bg-gray-400 active:bg-gray-200 dark:bg-slate-500 dark:hover:bg-slate-600 dark:active:bg-slate-400"
								onClick={() =>
									navigate(`/edit/coin/${coin.id}`)
								}
							>
								<PencilSimple size={20} weight="bold" />
							</button>

							<button
								className="input input flex max-w-[4.5rem] justify-center bg-red-400 py-2 font-semibold text-gray-800 hover:bg-red-500 active:bg-red-300"
								onClick={() => handleDeleteCoin(coin.id)}
							>
								<Trash size={20} weight="bold" />
							</button>
						</div>
					</div>
				))}
		</div>
	);
};

export default CoinBlocks;
