// Components
import { Message } from "../../components";

// Context
import { ThemeContext } from "../../context";

// Hooks
import { useGet, usePost, useUpdate } from "../../hooks";

// Interfaces
import { PresetData } from "../../interfaces/PresetData";

// Libraries
import { AnimatePresence, motion } from "framer-motion";
import { X } from "@phosphor-icons/react";

// React
import { FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Coin = () => {
	const { coinId } = useParams();
	const { state } = useContext(ThemeContext);

	const getData = useGet();
	const post = usePost();
	const update = useUpdate();

	const [loading, setLoading] = useState<boolean>(true);
	const [success, setSuccess] = useState<boolean>(false);
	const [error, setError] = useState<string>();

	const [presetUse, setPresetUse] = useState<boolean>(false);
	const [presets, setPresets] = useState<PresetData[]>();
	const [selectedPreset, setSelectedPreset] = useState<number>(0);

	const [yearRange, setYearRange] = useState<number[]>();

	const [name, setName] = useState<string>();
	const [symbol, setSymbol] = useState<string>();
	const [value, setValue] = useState<number>();
	const [year, setYear] = useState<number>();
	const [quantity, setQuantity] = useState<number>();

	const navigate = useNavigate();

	async function fetchCoin() {
		try {
			const data = await getData(`coins/${state.userUID}/coin/${coinId}`);

			setName(data[0].name);
			setSymbol(data[0].symbol);
			setValue(data[0].value);
			setYear(data[0].year);
			setQuantity(data[0].quantity);

			setLoading(false);
		} catch (error: any) {
			setError(error.message);
			setTimeout(() => setError(""), 3000);
		}
	}

	async function fetchPresets() {
		try {
			const data = await getData(`presets/${state.userUID}`);

			setPresets(data);
			handleSelectedPreset(0);

			setLoading(false);
		} catch (error: any) {
			setError(error.message);
			setTimeout(() => setError(""), 3000);
		}
	}

	function handlePresetUse() {
		setPresetUse(!presetUse);

		if (presetUse) {
			setName("");
			setSymbol("");
			setValue(0);
			setYear(0);
			setQuantity(1);
		} else {
			handleSelectedPreset(0);
		}
	}

	function handleSelectedPreset(index: number) {
		if (presets) {
			setSelectedPreset(index);

			const {
				name,
				symbol,
				value_range,
				initial_emission_date,
				final_emission_date,
			} = presets[index];

			setName(name);
			setSymbol(symbol);
			setValue(value_range[0]);
			setYear(initial_emission_date);
			setQuantity(1);

			setYearRange(
				Array.from(
					{
						length: final_emission_date - initial_emission_date + 1,
					},
					(_, index) => index + initial_emission_date
				)
			);
		}
	}

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();

		const data = {
			name,
			symbol,
			value,
			year,
			quantity,
		};

		try {
			if (coinId) {
				await update(`coins/${state.userUID}/coin/${coinId}`, data);

				setSuccess(true);
				setTimeout(() => {
					setSuccess(false);
					navigate("/");
				}, 3000);
			} else {
				await post(`coins/${state.userUID}`, data);

				setSuccess(true);
				setTimeout(() => setSuccess(false), 3000);
			}
		} catch (error: any) {
			setError(error.message);
			setTimeout(() => setError(""), 3000);
		}
	}

	useEffect(() => {
		if (coinId) {
			fetchCoin();
		} else {
			fetchPresets();
		}
	}, []);

	return (
		<motion.div
			className={`w-[85%] h-[85%] relative flex flex-col justify-center items-center bg-light-mode dark:bg-dark-mode border-8 border-black rounded-2xl dark:text-white shadow-solid`}
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
			exit={{ scale: 0 }}
			transition={{
				duration: 0.5,
				ease: "easeInOut",
			}}
		>
			<button
				className="absolute top-4 right-4"
				onClick={() => navigate("/")}
			>
				<X size={24} weight="bold" />
			</button>

			<div className="w-[50%]">
				<h1 className="text-4xl font-bold text-center mb-5">
					{coinId ? "Edit" : "Add"} Coin
				</h1>

				{!loading && (
					<div className="flex flex-col items-center">
						{!coinId && (
							<button
								className={`bg-${state.theme} text-black rounded-md px-6 py-2 hover:brightness-90 active:brightness-110`}
								onClick={handlePresetUse}
							>
								{!presetUse ? "Use Preset" : "Cancel"}
							</button>
						)}

						<AnimatePresence>
							{!presetUse ? (
								<form
									className="grid grid-cols-5 gap-5"
									onSubmit={(e) => handleSubmit(e)}
								>
									<div className="col-span-4">
										<label className="block text-md dark:text-white font-semibold mb-2">
											Name
										</label>
										<input
											type="text"
											id="name"
											className="w-full block bg-gray-50 dark:bg-slate-600 text-sm dark:text-white border border-gray-300 p-3 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											value={name}
											onChange={(e) =>
												setName(e.target.value)
											}
											required
										/>
									</div>

									<div className="col-span-1">
										<label className="block mb-2 text-md dark:text-white font-semibold">
											Symbol
										</label>
										<input
											type="text"
											id="symbol"
											className="w-full block bg-gray-50 dark:bg-slate-600 text-sm dark:text-white border border-gray-300 p-3 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											value={symbol}
											onChange={(e) =>
												setSymbol(e.target.value)
											}
											required
										/>
									</div>

									<div className="col-span-2">
										<label className="block mb-2 text-md dark:text-white font-semibold">
											Value
										</label>
										<input
											type="number"
											id="value"
											className="w-full block bg-gray-50 dark:bg-slate-600 text-sm dark:text-white border border-gray-300 p-3 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											value={value}
											onChange={(e) =>
												setValue(Number(e.target.value))
											}
											required
										/>
									</div>

									<div className="col-span-2">
										<label className="block mb-2 text-md dark:text-white font-semibold">
											Year
										</label>
										<input
											type="text"
											id="year"
											className="w-full block bg-gray-50 dark:bg-slate-600 text-sm dark:text-white border border-gray-300 p-3 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											maxLength={4}
											value={year}
											onChange={(e) =>
												setYear(Number(e.target.value))
											}
											required
										/>
									</div>

									<div className="col-span-1">
										<label className="block mb-2 text-md dark:text-white font-semibold">
											Quantity
										</label>
										<input
											type="number"
											id="quantity"
											className="w-full block bg-gray-50 dark:bg-slate-600 text-sm dark:text-white border border-gray-300 p-3 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											value={quantity}
											onChange={(e) =>
												setQuantity(
													Number(e.target.value)
												)
											}
											required
										/>
									</div>

									<button
										className="col-start-2 col-span-3 flex justify-center self-center bg-green-500 text-white font-semibold rounded-md px-6 py-2 mt-2 hover:bg-green-600 active:bg-green-400 disabled:bg-gray-400 disabled:cursor-not-allowed"
										disabled={success}
									>
										{coinId ? "Edit" : "Add"}
									</button>
								</form>
							) : (
								<form
									className="grid grid-cols-5 gap-5"
									onSubmit={(e) => handleSubmit(e)}
								>
									<div className="col-span-4">
										<label className="block mb-2 text-md dark:text-white font-semibold">
											Coin
										</label>
										<select
											className="w-full block bg-gray-50 dark:bg-slate-600 text-sm dark:text-white border border-gray-300 p-3 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											value={selectedPreset}
											onChange={(e) =>
												handleSelectedPreset(
													+e.target.value
												)
											}
											required
										>
											{presets &&
												presets.map((preset, i) => (
													<option
														value={i}
														key={preset.id}
													>
														{preset.name} (
														{
															preset.initial_emission_date
														}
														-
														{
															preset.final_emission_date
														}
														)
													</option>
												))}
										</select>
									</div>

									<div className="col-span-1">
										<label className="block mb-2 text-md dark:text-white font-semibold">
											Symbol
										</label>
										<input
											type="text"
											id="symbol"
											className="w-full block bg-gray-50 dark:bg-slate-600 text-sm dark:text-white border border-gray-300 p-3 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											value={symbol}
											onChange={(e) =>
												setSymbol(e.target.value)
											}
											required
										/>
									</div>

									<div className="col-span-2">
										<label className="block mb-2 text-md dark:text-white font-semibold">
											Value
										</label>
										<select
											className="w-full block bg-gray-50 dark:bg-slate-600 text-sm dark:text-white border border-gray-300 p-3 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											value={value}
											onChange={(e) =>
												setValue(+e.target.value)
											}
											required
										>
											{presets &&
												presets[
													selectedPreset
												].value_range.map((value) => (
													<option
														value={value}
														key={value}
													>
														{value}
													</option>
												))}
										</select>
									</div>

									<div className="col-span-2">
										<label className="block mb-2 text-md dark:text-white font-semibold">
											Year
										</label>
										<select
											className="w-full block bg-gray-50 dark:bg-slate-600 text-sm dark:text-white border border-gray-300 p-3 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											value={year}
											onChange={(e) =>
												setYear(+e.target.value)
											}
											required
										>
											{yearRange &&
												yearRange.map((year) => (
													<option
														value={year}
														key={year}
													>
														{year}
													</option>
												))}
										</select>
									</div>

									<div className="col-span-1">
										<label className="block mb-2 text-md dark:text-white font-semibold">
											Quantity
										</label>
										<input
											type="number"
											id="quantity"
											className="w-full block bg-gray-50 dark:bg-slate-600 text-sm dark:text-white border border-gray-300 p-3 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											value={quantity}
											onChange={(e) =>
												setQuantity(
													Number(e.target.value)
												)
											}
											required
										/>
									</div>

									<button
										className="col-start-2 col-span-3 flex justify-center self-center bg-green-500 text-white font-semibold rounded-md px-6 py-2 mt-2 hover:bg-green-600 active:bg-green-400 disabled:bg-gray-400 disabled:cursor-not-allowed"
										disabled={success}
									>
										Add
									</button>
								</form>
							)}
						</AnimatePresence>

						<AnimatePresence>
							{success && (
								<Message
									message="Coin added successfully"
									type="success"
								/>
							)}
							{error && <Message message={error} type="error" />}
						</AnimatePresence>
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default Coin;
