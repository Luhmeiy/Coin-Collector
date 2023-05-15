// Components
import { Arrow } from "../../components";

// Context
import { ThemeContext } from "../../context";

// Hooks
import { useDelete, useGet, useUpdate } from "../../hooks";

// Interfaces
import { PresetData } from "../../interfaces/PresetData";
import {
	PropertyProps,
	SortSettingsProps,
} from "../../interfaces/SortingProps";

// Libraries
import { motion } from "framer-motion";
import { PencilSimple, Trash } from "@phosphor-icons/react";

// React
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACTIONS } from "../../utils/reducer";

// Utils
import { sortData } from "../../utils/sortData";

const Presets = () => {
	const { state, dispatch } = useContext(ThemeContext);
	const [presets, setPresets] = useState<PresetData[]>();
	const [sortSettings, setSortSettings] = useState<SortSettingsProps>();

	const [error, setError] = useState<string>();

	const deleteData = useDelete();
	const getData = useGet();
	const update = useUpdate();
	const navigate = useNavigate();

	async function fetchPresets(presetSortSettings: {
		property: string;
		asc: boolean;
	}) {
		try {
			const data = await getData(
				`presets/${state.userUID}?order=${
					presetSortSettings?.property
				}&direction=${presetSortSettings.asc ? "asc" : "desc"}`
			);

			setPresets(data);
		} catch (error: any) {
			setError(error.message);
		}
	}

	async function handleDeletePreset(presetId: string) {
		try {
			await deleteData(`presets/${state.userUID}/preset/${presetId}`);
		} catch (error: any) {
			alert(error.message);
		}

		if (sortSettings) fetchPresets(sortSettings);
	}

	async function handleSortData(property: PropertyProps) {
		if (presets && sortSettings) {
			const { newSort, sortedData } = sortData(
				presets,
				sortSettings,
				property
			);

			setSortSettings(newSort);
			setPresets(sortedData);

			if (state.user) {
				dispatch({
					type: ACTIONS.ADD_USER,
					payload: {
						user: { ...state.user, presetSortSettings: newSort },
					},
				});
			}

			try {
				await update(`users/${state.userUID}`, {
					presetSortSettings: newSort,
				});
			} catch (error: any) {
				alert(error.message);
			}
		}
	}

	useEffect(() => {
		if (state.user && state.user.presetSortSettings) {
			setSortSettings(state.user.presetSortSettings);

			fetchPresets(state.user.presetSortSettings);
		}
	}, [state.user]);

	return (
		<>
			<motion.button
				className="w-0 absolute left-0 bg-black text-white font-semibold leading-5 break-words px-6 py-2"
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
				className={`w-[85%] h-[85%] flex flex-col bg-light-mode dark:bg-dark-mode dark:text-white border-8 border-black rounded-2xl shadow-solid overflow-auto`}
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
						{error && (
							<div className="h-full flex justify-center items-center text-lg font-semibold">
								{error}
							</div>
						)}
						{presets && sortSettings && (
							<div>
								<div
									className={`grid grid-cols-6 items-center bg-${state.theme} text-xl text-black font-bold border-b-2 border-black p-5 select-none`}
								>
									<p
										onClick={() => handleSortData("name")}
										className="flex items-center gap-1 cursor-pointer"
									>
										Preset Name
										{sortSettings.property === "name" && (
											<Arrow
												direction={sortSettings.asc}
											/>
										)}
									</p>
									<p>Symbol</p>
									<p
										onClick={() =>
											handleSortData(
												"initial_emission_date"
											)
										}
										className="flex items-center gap-1 cursor-pointer"
									>
										Initial Emission Date
										{sortSettings.property ===
											"initial_emission_date" && (
											<Arrow
												direction={sortSettings.asc}
											/>
										)}
									</p>
									<p
										onClick={() =>
											handleSortData(
												"final_emission_date"
											)
										}
										className="flex items-center gap-1 cursor-pointer"
									>
										Final Emission Date
										{sortSettings.property ===
											"final_emission_date" && (
											<Arrow
												direction={sortSettings.asc}
											/>
										)}
									</p>
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
