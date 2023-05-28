// Components
import { Arrow, FloatingMessage } from "../../components";

// Context
import { ThemeContext } from "../../context";

// Hooks
import { useDelete, useGet, useUpdate } from "../../hooks";

// Interfaces
import {
	PropertyProps,
	SortSettingsProps,
} from "../../interfaces/SortingProps";
import { CompleteCoinData } from "../../interfaces/CoinData";

// Libraries
import { AnimatePresence, motion } from "framer-motion";
import * as HoverCard from "@radix-ui/react-hover-card";
import { CaretDown, CaretUp, PencilSimple, Trash } from "@phosphor-icons/react";

// React
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACTIONS } from "../../utils/reducer";

// Utils
import { sortData } from "../../utils/sortData";

const Home = () => {
	const { state, dispatch } = useContext(ThemeContext);

	const [coins, setCoins] = useState<CompleteCoinData[]>();
	const [filteredCoins, setFilteredCoins] = useState<CompleteCoinData[]>();
	const [search, setSearch] = useState<string | null>(null);
	const [sortSettings, setSortSettings] = useState<SortSettingsProps>();

	const [error, setError] = useState<string>();

	const deleteData = useDelete();
	const getData = useGet();
	const update = useUpdate();
	const navigate = useNavigate();

	async function fetchCoins(coinSortSettings: {
		property: string;
		asc: boolean;
	}) {
		try {
			const data = await getData(
				`coins/${state.userUID}?order=${
					coinSortSettings.property
				}&direction=${coinSortSettings.asc ? "asc" : "desc"}`
			);

			setCoins(data);

			if (!search) setFilteredCoins(data);
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
				setTimeout(() => setError(""), 3000);
			}
		}
	}

	async function handleDeleteCoin(coinId: string) {
		if (filteredCoins) {
			const newFilter = filteredCoins.filter(
				(coin) => coin.id !== coinId
			);

			setFilteredCoins(newFilter);
		}

		try {
			await deleteData(`coins/${state.userUID}/coin/${coinId}`);
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
				setTimeout(() => setError(""), 3000);
			}
		}

		if (sortSettings) fetchCoins(sortSettings);
	}

	async function handleSortData(property: PropertyProps) {
		if (coins && sortSettings) {
			const { newSort, sortedData } = sortData(
				coins,
				sortSettings,
				property
			);

			setSortSettings(newSort);
			setCoins(sortedData);

			if (state.user) {
				dispatch({
					type: ACTIONS.ADD_USER,
					payload: {
						user: { ...state.user, coinSortSettings: newSort },
					},
				});
			}

			try {
				await update(`users/${state.userUID}`, {
					coinSortSettings: newSort,
				});
			} catch (error) {
				if (error instanceof Error) {
					setError(error.message);
					setTimeout(() => setError(""), 3000);
				}
			}
		}
	}

	async function handleUpdateQuantity(
		id: string,
		index: number,
		action: "ADD" | "SUBTRACT"
	) {
		if (!coins) return;

		let exitFunction = false;

		const updatedCoins = (coins ?? []).map((coin) => {
			if (coin.id === id) {
				if (
					coin.quantity > 1 ||
					(coin.quantity === 1 && action === "ADD")
				) {
					const updatedQuantity =
						action === "ADD"
							? coin.quantity + 1
							: coin.quantity - 1;
					return { ...coin, quantity: updatedQuantity };
				} else {
					setError("Quantity needs to be greater than 1");
					setTimeout(() => setError(""), 3000);

					exitFunction = true;
				}
			}

			return coin;
		});

		if (exitFunction) return;

		setCoins(updatedCoins);

		try {
			await update(
				`coins/${state.userUID}/coin/${id}`,
				updatedCoins[index]
			);
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
				setTimeout(() => setError(""), 3000);
			}
		}
	}

	function handleSearch(searchInput: string) {
		setSearch(searchInput);

		if (coins) {
			const filteredCoins = coins.filter(
				(coin) =>
					coin.name.includes(searchInput) ||
					String(coin.year).includes(searchInput)
			);

			setFilteredCoins(filteredCoins);
		}
	}

	useEffect(() => {
		if (state.user && state.user.coinSortSettings) {
			setSortSettings(state.user.coinSortSettings);

			fetchCoins(state.user.coinSortSettings);
		}
	}, [state.user]);

	useEffect(() => {
		if (search) handleSearch(search);
	}, [coins]);

	return (
		<>
			<motion.div
				className="shadow-solid z-10 flex h-[85%] w-[85%] flex-col overflow-hidden bg-light-mode dark:bg-dark-mode dark:text-gray-100"
				initial={{ translateY: -window.innerHeight }}
				animate={{ translateY: 0 }}
				exit={{ translateY: -window.innerHeight }}
				transition={{
					duration: 0.5,
					ease: "easeInOut",
				}}
			>
				{state.user && (
					<>
						<AnimatePresence>
							{error && <FloatingMessage message={error} />}
						</AnimatePresence>

						<div className="flex items-center justify-between border-b-4 border-b-black p-5">
							<div>
								<h1 className="mb-2 text-xl">
									Welcome,{" "}
									<span className="font-semibold">
										{state.user.displayName}
									</span>
								</h1>

								{coins && (
									<>
										<p>
											Collected Coins:{" "}
											<span className="font-semibold">
												{coins.reduce(
													(a, b) =>
														a +
														(b["quantity"] || 0),
													0
												)}
											</span>
										</p>

										<p>
											Unique Coins:{" "}
											<span className="font-semibold">
												{coins.length}
											</span>
										</p>
									</>
								)}
							</div>

							<div className="flex flex-col items-stretch gap-2">
								<button
									className={`flex justify-center bg-${state.theme} input px-6 py-2 font-semibold text-gray-800 hover:brightness-90 active:brightness-110`}
									onClick={() => navigate("/add/coin")}
								>
									Add Coin
								</button>
								<button
									className={`flex justify-center bg-${state.theme} input px-6 py-2 font-semibold text-gray-800 hover:brightness-90 active:brightness-110`}
									onClick={() => navigate("/add/preset")}
								>
									Add Preset
								</button>
							</div>
						</div>

						{sortSettings && (
							<div className="flex flex-grow flex-col overflow-y-hidden">
								<div
									className={`relative grid grid-cols-6 gap-3 bg-${state.theme} select-none border-b-2 border-black p-5 text-lg font-semibold text-gray-800`}
								>
									<p
										onClick={() => handleSortData("name")}
										className="flex cursor-pointer items-center gap-1"
									>
										Coin
										{sortSettings.property === "name" && (
											<Arrow
												direction={sortSettings.asc}
											/>
										)}
									</p>
									<p
										onClick={() => handleSortData("value")}
										className="flex cursor-pointer items-center gap-1"
									>
										Value
										{sortSettings.property === "value" && (
											<Arrow
												direction={sortSettings.asc}
											/>
										)}
									</p>
									<p
										onClick={() => handleSortData("year")}
										className="flex cursor-pointer items-center gap-1"
									>
										Year
										{sortSettings.property === "year" && (
											<Arrow
												direction={sortSettings.asc}
											/>
										)}
									</p>
									<p
										onClick={() =>
											handleSortData("quantity")
										}
										className="flex cursor-pointer items-center gap-1"
									>
										Quantity
										{sortSettings.property ===
											"quantity" && (
											<Arrow
												direction={sortSettings.asc}
											/>
										)}
									</p>
									<p className="col-span-2">Actions</p>

									<div className="absolute bottom-0 right-8 z-20 w-[25%] max-w-[9.375rem] translate-y-full">
										<input
											type="text"
											onChange={(e) =>
												handleSearch(e.target.value)
											}
											className="input input--search h-7 rounded-t-none bg-gray-100"
										/>
									</div>
								</div>

								{(!filteredCoins ||
									filteredCoins.length === 0) && (
									<div className="flex flex-grow items-center justify-center text-lg font-semibold">
										No coins here
									</div>
								)}

								{filteredCoins && (
									<div
										className={`[&>*:nth-child(even)]:bg-${state.mode} overflow-y-auto scrollbar scrollbar-thumb-zinc-400 [&>*:nth-child(even)]:backdrop-brightness-75`}
									>
										{filteredCoins.map((coin, i) => (
											<div
												key={coin.id}
												className="grid grid-cols-6 items-center gap-3 border-b-2 border-r-2 border-black p-5"
											>
												<p>
													{coin.name}{" "}
													{coin.note && (
														<HoverCard.Root
															openDelay={0}
														>
															<HoverCard.Trigger
																asChild
															>
																<sup
																	className="cursor-pointer font-semibold"
																	rel="noreferrer noopener"
																>
																	(note)
																</sup>
															</HoverCard.Trigger>

															<HoverCard.Portal>
																<HoverCard.Content
																	className="input z-20 max-w-[300px] bg-light-mode p-3 dark:bg-dark-mode dark:text-gray-100"
																	side="right"
																	sideOffset={
																		6
																	}
																>
																	<span className="font-semibold">
																		Note:{" "}
																	</span>
																	{coin.note}

																	<HoverCard.Arrow className="fill-black" />
																</HoverCard.Content>
															</HoverCard.Portal>
														</HoverCard.Root>
													)}
												</p>
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
																handleUpdateQuantity(
																	coin.id,
																	i,
																	"ADD"
																)
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
															navigate(
																`/edit/coin/${coin.id}`
															)
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
														className="input flex w-auto items-center rounded-md bg-red-400 px-6 py-2 font-semibold text-gray-800 hover:bg-red-500 active:bg-red-300"
														onClick={() =>
															handleDeleteCoin(
																coin.id
															)
														}
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
								)}
							</div>
						)}
					</>
				)}
			</motion.div>

			<motion.button
				className="absolute right-0 z-10 w-0 break-words bg-black px-6 py-2 font-semibold uppercase leading-5 text-gray-100"
				initial={{ translateY: -window.innerHeight }}
				animate={{ translateY: 0 }}
				exit={{ translateY: -window.innerHeight }}
				transition={{
					duration: 0.5,
					ease: "easeInOut",
				}}
				onClick={() => navigate("/presets")}
			>
				Presets
			</motion.button>
		</>
	);
};

export default Home;
