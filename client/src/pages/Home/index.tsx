// Components
import { Arrow } from "../../components";

// Context
import { ThemeContext } from "../../context";

// Hooks
import { useDelete, useGet, useUpdate } from "../../hooks";

// Interfaces
import {
	PropertyProps,
	SortSettingsProps,
} from "../../interfaces/SortingProps";

// Libraries
import { motion } from "framer-motion";
import { CaretDown, CaretUp, PencilSimple, Trash } from "@phosphor-icons/react";

// React
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACTIONS } from "../../utils/reducer";

// Utils
import { sortData } from "../../utils/sortData";

interface CoinData {
	id: string;
	name: string;
	symbol: string;
	value: number;
	year: number;
	quantity: number;
}

const Home = () => {
	const { state, dispatch } = useContext(ThemeContext);
	const [coins, setCoins] = useState<CoinData[]>();
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
		} catch (error: any) {
			setError(error.message);
		}
	}

	async function handleDeleteCoin(coinId: string) {
		try {
			await deleteData(`coins/${state.userUID}/coin/${coinId}`);
		} catch (error: any) {
			alert(error.message);
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
			} catch (error: any) {
				alert(error.message);
			}
		}
	}

	async function handleUpdateQuantity(
		id: string,
		index: number,
		action: "ADD" | "SUBTRACT"
	) {
		if (!coins) return;

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
					alert("Quantity needs to be greater than 1");
				}
			}

			return coin;
		});

		setCoins(updatedCoins);

		try {
			await update(
				`coins/${state.userUID}/coin/${id}`,
				updatedCoins[index]
			);
		} catch (error: any) {
			alert(error.message);
		}
	}

	useEffect(() => {
		if (state.user && state.user.coinSortSettings) {
			setSortSettings(state.user.coinSortSettings);

			fetchCoins(state.user.coinSortSettings);
		}
	}, [state.user]);

	return (
		<>
			<motion.div
				className={`w-[85%] h-[85%] flex flex-col border-8 border-black rounded-2xl bg-light-mode dark:bg-dark-mode dark:text-white shadow-solid overflow-auto`}
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
						<div className="min-h-[20%] flex justify-between items-center border-b-8 border-b-black p-5">
							<div>
								<h1 className="text-2xl font-bold mb-2">
									Welcome, {state.user.displayName}
								</h1>

								{coins && (
									<>
										<p className="text-lg">
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

										<p className="text-lg">
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
									className={`flex justify-center bg-${state.theme} text-black rounded-md px-6 py-2 hover:brightness-90 active:brightness-110`}
									onClick={() => navigate("/add/coin")}
								>
									Add Coin
								</button>
								<button
									className={`flex justify-center bg-${state.theme} text-black rounded-md px-6 py-2 hover:brightness-90 active:brightness-110`}
									onClick={() => navigate("/add/preset")}
								>
									Add Preset
								</button>
							</div>
						</div>

						{error && (
							<div className="h-full flex justify-center items-center text-lg font-semibold">
								{error}
							</div>
						)}

						{coins && sortSettings && (
							<div>
								<div
									className={`grid grid-cols-5 bg-${state.theme} text-xl text-black font-bold  border-b-2 border-black p-5 select-none`}
								>
									<p
										onClick={() => handleSortData("name")}
										className="flex items-center gap-1 cursor-pointer"
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
										className="flex items-center gap-1 cursor-pointer"
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
										className="flex items-center gap-1 cursor-pointer"
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
										className="flex items-center gap-1 cursor-pointer"
									>
										Quantity
										{sortSettings.property ===
											"quantity" && (
											<Arrow
												direction={sortSettings.asc}
											/>
										)}
									</p>
									<p>Actions</p>
								</div>

								<div
									className={`[&>*:nth-child(even)]:bg-${state.mode} [&>*:nth-child(even)]:backdrop-brightness-75`}
								>
									{coins.map((coin, i) => (
										<div
											key={coin.id}
											className="grid grid-cols-5 items-center p-4"
										>
											<p>{coin.name}</p>
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

											<div className="flex flex-wrap gap-4">
												<button
													className="flex items-center bg-gray-300 dark:bg-slate-500 text-black rounded-md px-6 py-2  hover:bg-gray-400 dark:hover:bg-slate-600 active:bg-gray-200 dark:active:bg-slate-400"
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
													className="flex items-center bg-red-400 text-black rounded-md px-6 py-2 hover:bg-red-500 active:bg-red-300"
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
							</div>
						)}
					</>
				)}
			</motion.div>

			<motion.button
				className="w-0 absolute right-0 bg-black text-white font-semibold leading-5 break-words px-6 py-2"
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
