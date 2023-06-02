// Interfaces
import { CoinListingProps } from "../../interfaces/CoinListingProps";

// Libraries
import * as Popover from "@radix-ui/react-popover";
import { CaretDown, CaretUp, PencilSimple, Trash } from "@phosphor-icons/react";

// React
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context";

const CoinList = ({
	filteredCoins,
	handleUpdateQuantity,
	handleDeleteCoin,
}: CoinListingProps) => {
	const { state } = useContext(ThemeContext);

	const navigate = useNavigate();

	return (
		<div
			className={`[&>*:nth-child(even)]:bg-${state.mode} overflow-y-auto scrollbar scrollbar-thumb-zinc-400 max-tablet:hidden [&>*:nth-child(even)]:backdrop-brightness-75`}
		>
			{filteredCoins &&
				filteredCoins.map((coin, i) => (
					<div
						key={coin.id}
						className="grid grid-cols-6 items-center gap-3 border-b-2 border-r-2 border-black p-5"
					>
						<div className="relative">
							{coin.name}{" "}
							{coin.note && (
								<Popover.Root>
									<Popover.Trigger asChild>
										<sup className="inline cursor-pointer font-semibold">
											(note)
										</sup>
									</Popover.Trigger>
									<Popover.Portal>
										<Popover.Content
											className="input z-20 max-w-[18.75rem] bg-light-mode p-3 dark:bg-dark-mode dark:text-gray-100"
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
						<p>
							{coin.symbol} {coin.value}
						</p>
						<p>{coin.year}</p>

						<div className="flex gap-6">
							{coin.quantity}

							<div>
								<CaretUp
									size={12}
									weight="bold"
									className="cursor-pointer"
									onClick={() =>
										handleUpdateQuantity(coin.id, i, "ADD")
									}
								/>

								<CaretDown
									size={12}
									weight="bold"
									className="cursor-pointer"
									onClick={() =>
										handleUpdateQuantity(
											coin.id,
											i,
											"SUBTRACT"
										)
									}
								/>
							</div>
						</div>

						<div className="col-span-2 flex flex-wrap gap-2">
							<button
								className="input flex w-auto items-center bg-gray-300 px-6 py-2 font-semibold text-gray-800 hover:bg-gray-400 active:bg-gray-200 dark:bg-slate-500 dark:hover:bg-slate-600 dark:active:bg-slate-400"
								onClick={() =>
									navigate(`/edit/coin/${coin.id}`)
								}
							>
								<PencilSimple
									size={20}
									weight="bold"
									className="mr-2"
								/>{" "}
								Edit
							</button>

							<button
								className="input flex w-auto items-center bg-red-400 px-6 py-2 font-semibold text-gray-800 hover:bg-red-500 active:bg-red-300"
								onClick={() => handleDeleteCoin(coin.id)}
							>
								<Trash
									size={20}
									weight="bold"
									className="mr-2"
								/>{" "}
								Delete
							</button>
						</div>
					</div>
				))}
		</div>
	);
};

export default CoinList;
