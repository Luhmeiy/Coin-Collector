// Components
import { Arrow, FloatingMessage } from "../../components";

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
import { AnimatePresence, motion } from "framer-motion";
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
	const [filteredPresets, setFilteredPresets] = useState<PresetData[]>();
	const [search, setSearch] = useState<string | null>(null);
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

			if (!search) setFilteredPresets(data);
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
				setTimeout(() => setError(""), 3000);
			}
		}
	}

	async function handleDeletePreset(presetId: string) {
		try {
			await deleteData(`presets/${state.userUID}/preset/${presetId}`);
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
				setTimeout(() => setError(""), 3000);
			}
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
			} catch (error) {
				if (error instanceof Error) {
					setError(error.message);
					setTimeout(() => setError(""), 3000);
				}
			}
		}
	}

	function handleSearch(searchInput: string) {
		setSearch(searchInput);

		if (presets) {
			const filteredCoins = presets.filter((preset) =>
				preset.name.includes(searchInput)
			);

			setFilteredPresets(filteredCoins);
		}
	}

	useEffect(() => {
		if (state.user && state.user.presetSortSettings) {
			setSortSettings(state.user.presetSortSettings);

			fetchPresets(state.user.presetSortSettings);
		}
	}, [state.user]);

	useEffect(() => {
		if (search) handleSearch(search);
	}, [presets]);

	return (
		<>
			<motion.button
				className="absolute left-0 z-10 w-0 break-words bg-black px-6 py-2 text-center font-semibold uppercase leading-5 text-gray-100"
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
				className="shadow-solid z-10 flex h-[85%] w-[85%] flex-col overflow-hidden bg-light-mode dark:bg-dark-mode dark:text-gray-100"
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
						<AnimatePresence>
							{error && <FloatingMessage message={error} />}
						</AnimatePresence>

						{sortSettings && (
							<div className="flex flex-grow flex-col overflow-y-hidden">
								<div
									className={`relative grid grid-cols-7 items-center gap-3 bg-${state.theme} select-none border-b-2 border-black p-5 text-lg font-semibold text-gray-800`}
								>
									<p
										onClick={() => handleSortData("name")}
										className="flex cursor-pointer items-center gap-1"
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
										className="flex cursor-pointer items-center gap-1"
									>
										Initial Emission
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
										className="flex cursor-pointer items-center gap-1"
									>
										Final Emission
										{sortSettings.property ===
											"final_emission_date" && (
											<Arrow
												direction={sortSettings.asc}
											/>
										)}
									</p>
									<p>Value Range</p>
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

								{(!filteredPresets ||
									filteredPresets.length === 0) && (
									<div className="flex flex-grow items-center justify-center text-lg font-semibold">
										No presets here
									</div>
								)}

								{filteredPresets && (
									<div
										className={`[&>*:nth-child(even)]:bg-${state.mode} overflow-y-auto scrollbar scrollbar-thumb-zinc-400 [&>*:nth-child(even)]:backdrop-brightness-75`}
									>
										{filteredPresets.map((preset) => (
											<div
												key={preset.id}
												className="grid grid-cols-7 items-center gap-3 border-b-2 border-r-2 border-black p-5"
											>
												<p>{preset.name}</p>
												<p>{preset.symbol}</p>
												<p>
													{
														preset.initial_emission_date
													}
												</p>
												<p>
													{preset.final_emission_date}
												</p>

												<p>
													{preset.value_range.map(
														(value, i) => {
															return (
																<span
																	key={
																		value +
																		i
																	}
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

												<div className="col-span-2 flex flex-wrap gap-2">
													<button
														className="input flex w-auto items-center gap-2 bg-gray-300 px-6 py-2 font-semibold text-gray-800 hover:bg-gray-400 active:bg-gray-200 dark:bg-slate-500 dark:hover:bg-slate-600 dark:active:bg-slate-400"
														onClick={() =>
															navigate(
																`/edit/preset/${preset.id}`
															)
														}
													>
														<PencilSimple
															size={20}
															weight="bold"
														/>{" "}
														Edit
													</button>

													<button
														className="input flex w-auto items-center gap-2 bg-red-400 px-6 py-2 font-semibold text-gray-800 hover:bg-red-500 active:bg-red-300"
														onClick={() =>
															handleDeletePreset(
																preset.id
															)
														}
													>
														<Trash
															size={20}
															weight="bold"
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
		</>
	);
};

export default Presets;
