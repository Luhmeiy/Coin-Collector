import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context";
import { motion } from "framer-motion";
import { PencilSimple, Trash } from "@phosphor-icons/react";

interface presetData {
	id: string;
	final_emission_date: number;
	initial_emission_date: number;
	name: string;
	symbol: string;
	value_range: number[];
}

const Presets = () => {
	const { state } = useContext(ThemeContext);
	const [presets, setPresets] = useState<presetData[]>();

	const navigate = useNavigate();

	async function fetchPresets() {
		await fetch(
			`${state.serverURL}/presets/${state.userUID}?order=initial_emission_date`
		)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				setPresets(data);
			});
	}

	async function handleDeletePreset(presetId: string) {
		await fetch(
			`${state.serverURL}/presets/${state.userUID}/preset/${presetId}`,
			{
				method: "DELETE",
			}
		);

		fetchPresets();
	}

	useEffect(() => {
		fetchPresets();
	}, []);

	return (
		<>
			<motion.button
				className="absolute left-0 bg-black text-white break-words w-0 font-semibold px-6 py-2 leading-5"
				initial={{ translateX: window.innerWidth }}
				animate={{ translateX: 0 }}
				exit={{ translateX: window.innerWidth }}
				transition={{
					duration: 0.5,
					ease: "easeInOut",
				}}
				onClick={() => navigate("/")}
			>
				Coins
			</motion.button>

			<motion.div
				className={`w-[85%] h-[85%] flex flex-col border-8 border-black rounded-2xl bg-light-mode dark:bg-dark-mode dark:text-white shadow-solid overflow-auto`}
				initial={{ translateX: window.innerWidth }}
				animate={{ translateX: 0 }}
				exit={{ translateX: window.innerWidth }}
				transition={{
					duration: 0.5,
					ease: "easeInOut",
				}}
			>
				{state.user && (
					<>
						{presets && (
							<div>
								<div
									className={`grid grid-cols-6 items-center border-b-2 bg-${state.theme} border-black text-xl font-bold text-black p-5`}
								>
									<p>Preset Name</p>
									<p>Symbol</p>
									<p>Initial Emission Date</p>
									<p>Final Emission Date</p>
									<p>Value Range</p>
									<p>Actions</p>
								</div>

								<div
									className={`[&>*:nth-child(even)]:bg-${state.mode} [&>*:nth-child(even)]:backdrop-brightness-75`}
								>
									{presets.map((preset) => (
										<div
											key={preset.id}
											className="grid grid-cols-6 items-center p-4"
										>
											<p>{preset.name}</p>
											<p>{preset.symbol}</p>
											<p>
												{preset.initial_emission_date}
											</p>
											<p>{preset.final_emission_date}</p>

											<p>
												{preset.value_range.map(
													(value, i) => {
														return (
															<span
																key={value + i}
															>
																{value}
																{preset
																	.value_range
																	.length ===
																i + 1
																	? ""
																	: ", "}
															</span>
														);
													}
												)}
											</p>

											<div className="flex flex-wrap gap-4">
												<button
													className="flex items-center bg-gray-300 dark:bg-slate-500 text-black rounded-md px-6 py-2  hover:bg-gray-400 dark:hover:bg-slate-600 active:bg-gray-200 dark:active:bg-slate-400"
													onClick={() =>
														navigate(
															`/edit/preset/${preset.id}`
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
														handleDeletePreset(
															preset.id
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
		</>
	);
};

export default Presets;
