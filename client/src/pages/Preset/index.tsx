// Components
import { Message } from "../../components";

// Context
import { ThemeContext } from "../../context";

// Hooks
import { useGet, usePost, useUpdate } from "../../hooks";

// Libraries
import { AnimatePresence, motion } from "framer-motion";
import { X } from "@phosphor-icons/react";

// React
import { FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Preset = () => {
	const { presetId } = useParams();
	const { state } = useContext(ThemeContext);

	const getData = useGet();
	const post = usePost();
	const update = useUpdate();

	const [loading, setLoading] = useState<boolean>(true);
	const [success, setSuccess] = useState<boolean>(false);
	const [error, setError] = useState<string>();

	const [name, setName] = useState<string>();
	const [symbol, setSymbol] = useState<string>();
	const [initialDate, setInitialDate] = useState<number>();
	const [finalDate, setFinalDate] = useState<number>();
	const [valueRange, setValueRange] = useState<string>();

	const navigate = useNavigate();

	async function fetchPreset() {
		try {
			const data = await getData(
				`presets/${state.userUID}/preset/${presetId}`
			);

			setName(data[0].name);
			setSymbol(data[0].symbol);
			setInitialDate(data[0].initial_emission_date);
			setFinalDate(data[0].final_emission_date);
			setValueRange(data[0].value_range);

			setLoading(false);
		} catch (error: any) {
			setError(error.message);
			setTimeout(() => setError(""), 3000);
		}
	}

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();

		const data = {
			name,
			symbol,
			initial_emission_date: initialDate,
			final_emission_date: finalDate,
			value_range:
				typeof valueRange === "object"
					? valueRange
					: valueRange?.split(",").map(Number),
		};

		try {
			if (presetId) {
				await update(
					`presets/${state.userUID}/preset/${presetId}`,
					data
				);

				setSuccess(true);
				setTimeout(() => {
					setSuccess(false);
					navigate("/presets");
				}, 3000);
			} else {
				await post(`presets/${state.userUID}`, data);

				setSuccess(true);
				setTimeout(() => setSuccess(false), 3000);
			}
		} catch (error: any) {
			setError(error.message);
			setTimeout(() => setError(""), 3000);
		}
	}

	useEffect(() => {
		if (presetId) {
			fetchPreset();
		} else {
			setLoading(false);
		}
	}, []);

	return (
		<motion.div
			className={`w-[85%] h-[85%] relative flex flex-col justify-center items-center bg-light-mode dark:bg-dark-mode dark:text-white border-8 border-black rounded-2xl shadow-solid`}
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
				onClick={() =>
					presetId ? navigate("/presets") : navigate("/")
				}
			>
				<X size={24} weight="bold" />
			</button>

			<div className="w-[50%]">
				<h1 className="text-4xl font-bold text-center mb-5">
					{presetId ? "Edit" : "Add"} Preset
				</h1>

				{!loading && (
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
								className="w-full block bg-gray-50 dark:bg-slate-600 text-sm dark:text-white border border-gray-300 dark:border-gray-600 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={name || ""}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>

						<div className="col-span-1">
							<label className="block text-md dark:text-white font-semibold mb-2">
								Symbol
							</label>
							<input
								type="text"
								id="symbol"
								className="w-full block bg-gray-50 dark:bg-slate-600 text-sm dark:text-white border border-gray-300 dark:border-gray-600 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={symbol || ""}
								onChange={(e) => setSymbol(e.target.value)}
								required
							/>
						</div>

						<div className="col-span-2">
							<label className="block text-md dark:text-white font-semibold mb-2">
								Initial Emission Date
							</label>
							<input
								type="string"
								id="initial-date"
								className="w-full block bg-gray-50 dark:bg-slate-600 text-sm dark:text-white border border-gray-300 dark:border-gray-600 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
								maxLength={4}
								value={initialDate || ""}
								onChange={(e) =>
									setInitialDate(Number(e.target.value))
								}
								required
							/>
						</div>

						<div className="col-span-3">
							<label className="block text-md dark:text-white font-semibold mb-2">
								Final Emission Date
							</label>
							<input
								type="string"
								id="final-date"
								className="w-full block bg-gray-50 dark:bg-slate-600 text-sm dark:text-white border border-gray-300 dark:border-gray-600 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
								maxLength={4}
								value={finalDate || ""}
								onChange={(e) =>
									setFinalDate(Number(e.target.value))
								}
								required
							/>
						</div>

						<div className="col-span-5">
							<label className="block text-md dark:text-white font-semibold mb-2">
								Value Range
							</label>
							<input
								type="text"
								id="value-range"
								className="w-full block bg-gray-50 dark:bg-slate-600 text-sm dark:text-white border border-gray-300 dark:border-gray-600 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={valueRange || ""}
								onChange={(e) => setValueRange(e.target.value)}
								required
							/>
						</div>

						<button
							className="col-start-2 col-span-3 flex justify-center self-center bg-green-500 text-white font-semibold rounded-md px-6 py-2 mt-2 hover:bg-green-600 active:bg-green-400 disabled:bg-gray-400 disabled:cursor-not-allowed"
							disabled={success}
						>
							{presetId ? "Edit" : "Add"}
						</button>

						<AnimatePresence>
							{success && (
								<Message
									message={`Preset ${
										presetId ? "edited" : "added"
									} successfully`}
									type="success"
								/>
							)}
							{error && <Message message={error} type="error" />}
						</AnimatePresence>
					</form>
				)}
			</div>
		</motion.div>
	);
};

export default Preset;
