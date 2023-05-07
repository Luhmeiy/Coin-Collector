import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../context";
import { motion } from "framer-motion";
import { PencilSimple, Trash } from "@phosphor-icons/react";

interface coinData {
	name: string;
	symbol: string;
	value: number;
	year: number;
}

const Home = () => {
	const { state } = useContext(ThemeContext);
	const [coins, setCoins] = useState<coinData[]>();

	async function fetchCoins() {
		await fetch(`${state.serverURL}/${state.userUID}/coins`)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				setCoins(data);
			});
	}

	useEffect(() => {
		fetchCoins();
	}, []);

	return (
		<motion.div
			className="w-[85%] h-[85%] flex flex-col border-8 border-black rounded-2xl bg-light-background shadow-solid"
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
								className={`grid grid-cols-5 border-b-2 bg-${state.theme} border-black text-xl font-bold p-5`}
							>
								<p>Coin</p>
								<p>Value</p>
								<p>Year</p>
								<p>Quantity</p>
								<p>Actions</p>
							</div>

							<div className="[&>*:nth-child(even)]:bg-[#d7cdb5]">
								{coins.map((coin) => (
									<div
										key={coin.name + coin.year}
										className="grid grid-cols-5 items-center p-4"
									>
										<p>{coin.name}</p>
										<p>
											{coin.symbol} {coin.value}
										</p>
										<p>{coin.year}</p>
										<p></p>

										<div className="flex flex-wrap gap-4">
											<button className="flex items-center bg-gray-300 rounded-md px-6 py-2 hover:bg-gray-400 active:bg-gray-200">
												<PencilSimple
													size={20}
													weight="bold"
													className="mr-2"
												/>{" "}
												Edit
											</button>

											<button className="flex items-center bg-red-400 rounded-md px-6 py-2 hover:bg-red-500 active:bg-red-300">
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
	);
};

export default Home;
