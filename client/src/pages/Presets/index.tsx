// Components
import {
	Arrow,
	FloatingMessage,
	PresetBlocks,
	PresetList,
} from "../../components";

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
import { CaretDown } from "@phosphor-icons/react";

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

	const [isContentOpen, setIsContentOpen] = useState(false);

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

				setIsContentOpen(false);
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

	const PresetListingProps = {
		filteredPresets,
		handleDeletePreset,
	};

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
				className="absolute left-0 z-10 w-0 break-words bg-black px-6 py-2 text-center font-semibold uppercase leading-5 text-gray-100 max-tablet:bottom-0 max-tablet:right-0 max-tablet:mx-auto max-tablet:w-max"
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
				className="shadow-solid z-10 flex h-[85%] w-[85%] flex-col overflow-hidden bg-light-mode dark:bg-dark-mode dark:text-gray-100 max-tablet:h-[85dvh] max-tablet:w-[90%]"
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
								{/* Mobile version */}
								<div
									className={`relative hidden text-gray-800 max-tablet:grid`}
								>
									<div
										className={`absolute bottom-0 left-8 z-20 h-7 w-max translate-y-full rounded-t-none border-t-0 bg-gray-100 p-0 ${
											!isContentOpen && "input"
										} max-phone:left-4`}
										onClick={() => setIsContentOpen(true)}
									>
										<div
											className={`${
												isContentOpen && "hidden"
											}`}
										>
											<p className="flex items-center gap-1 pl-2 pr-8 capitalize">
												<span className="overflow-hidden overflow-ellipsis whitespace-nowrap max-phone:max-w-[8ch]">
													{sortSettings.property
														.split("_", 2)
														.join(" ")}{" "}
												</span>

												<Arrow
													direction={sortSettings.asc}
												/>
											</p>

											<CaretDown
												size={16}
												weight="bold"
												className="absolute bottom-0 right-2 top-0 my-auto"
											/>
										</div>

										{isContentOpen && (
											<div className="input flex w-full flex-col gap-1 rounded-t-none border-t-0 bg-gray-100 p-2">
												<p
													onClick={() =>
														handleSortData("name")
													}
													className="flex cursor-pointer items-center gap-1"
												>
													Name
													{sortSettings.property ===
														"name" && (
														<Arrow
															direction={
																sortSettings.asc
															}
														/>
													)}
												</p>
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
															direction={
																sortSettings.asc
															}
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
															direction={
																sortSettings.asc
															}
														/>
													)}
												</p>
											</div>
										)}
									</div>

									<div className="absolute bottom-0 right-8 z-20 w-[25%] min-w-[7.25rem] max-w-[9.375rem] translate-y-full max-phone:right-4">
										<input
											type="text"
											onChange={(e) =>
												handleSearch(e.target.value)
											}
											className="input input--search h-7 rounded-t-none border-t-0 bg-gray-100"
										/>
									</div>
								</div>

								{/* Desktop version */}
								<div
									className={`relative grid grid-cols-7 items-center gap-3 bg-${state.theme} select-none border-b-2 border-black p-5 text-lg font-semibold text-gray-800 max-tablet:hidden`}
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
									<>
										<PresetList {...PresetListingProps} />
										<PresetBlocks {...PresetListingProps} />
									</>
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
