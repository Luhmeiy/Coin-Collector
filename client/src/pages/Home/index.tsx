import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../context";
import { motion } from "framer-motion";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

export interface coinData {
	id: string;
	name: string;
	symbol: string;
	value: number;
	year: number;
	quantity: number;
}

const Home = () => {
	const { state } = useContext(ThemeContext);
	const [coins, setCoins] = useState<coinData[]>();

	const navigate = useNavigate();

	async function fetchCoins() {
		await fetch(`${state.serverURL}/coins/${state.userUID}`)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				setCoins(data);
			});
	}

	async function handleDeleteCoin(coinId: string) {
		await fetch(
			`${state.serverURL}/coins/${state.userUID}/coin/${coinId}`,
			{
				method: "DELETE",
			}
		);

		fetchCoins();
	}

	useEffect(() => {
		fetchCoins();
	}, []);

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
						<div className="h-[20%] flex items-center border-b-8 border-b-black p-5">
							<h1 className="text-2xl font-bold mb-2">
								Welcome, {state.user.displayName}
							</h1>
						</div>

						{coins && (
							<div>
								<div
									className={`grid grid-cols-5 border-b-2 bg-${state.theme} border-black text-xl font-bold text-black p-5`}
								>
									<p>Coin</p>
									<p>Value</p>
									<p>Year</p>
									<p>Quantity</p>
									<p>Actions</p>
								</div>

								<div
									className={`[&>*:nth-child(even)]:bg-${state.mode} [&>*:nth-child(even)]:backdrop-brightness-75`}
								>
									{coins.map((coin) => (
										<div
											key={coin.id}
											className="grid grid-cols-5 items-center p-4"
										>
											<p>{coin.name}</p>
											<p>
												{coin.symbol} {coin.value}
											</p>
											<p>{coin.year}</p>
											<p>{coin.quantity}</p>

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
				className="absolute right-0 bg-black text-white break-words w-0 font-semibold px-6 py-2 leading-5"
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
