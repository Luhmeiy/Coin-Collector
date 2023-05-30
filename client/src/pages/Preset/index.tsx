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
			className="shadow-solid relative z-10 flex min-h-[85%] w-[85%] flex-col items-center justify-center bg-light-mode dark:bg-dark-mode dark:text-gray-100"
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
			exit={{ scale: 0 }}
			transition={{
				duration: 0.5,
				ease: "easeInOut",
			}}
		>
			<button
				className="absolute right-4 top-4"
				onClick={() =>
					presetId ? navigate("/presets") : navigate("/")
				}
			>
				<X size={24} weight="bold" />
			</button>

			<div className="flex w-[50%] flex-col items-center gap-6 max-laptop:w-[75%] max-form:gap-2">
				<h1 className="text-[4rem] font-bold max-form:text-[2rem]">
					{presetId ? "Edit" : "Add"} Preset
				</h1>

				{!loading && (
					<>
						<form
							className="grid grid-cols-6 gap-5  py-2 max-form:max-w-[300px] max-form:grid-cols-1"
							onSubmit={handleSubmit}
						>
							<div className="col-span-4 max-form:col-span-full">
								<label className="input-container">
									<span>Name</span>
									<input
										type="text"
										className="!px-4 !py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										value={name || ""}
										onChange={(e) =>
											setName(e.target.value)
										}
										required
									/>
								</label>
							</div>

							<div className="col-span-2 max-form:col-span-full">
								<label className="input-container">
									<span>Symbol</span>
									<input
										type="text"
										className="!px-4 !py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										value={symbol || ""}
										onChange={(e) =>
											setSymbol(e.target.value)
										}
										required
									/>
								</label>
							</div>

							<div className="col-span-3 max-form:col-span-full">
								<label className="input-container">
									<span>Initial Emission Date</span>
									<input
										type="number"
										className="!px-4 !py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										value={initialDate || ""}
										onChange={(e) => {
											if (e.target.value.length <= 4) {
												setInitialDate(+e.target.value);
											}
										}}
										required
									/>
								</label>
							</div>

							<div className="col-span-3 max-form:col-span-full">
								<label className="input-container">
									<span>Final Emission Date</span>
									<input
										type="number"
										className="!px-4 !py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										value={finalDate || ""}
										onChange={(e) => {
											if (e.target.value.length <= 4) {
												setFinalDate(+e.target.value);
											}
										}}
										required
									/>
								</label>
							</div>

							<div className="col-span-full">
								<label className="input-container">
									<span>
										Value Range{" "}
										<span className="!font-normal">
											(Separated by comma)
										</span>
									</span>
									<input
										type="string"
										className="!px-4 !py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										value={valueRange || ""}
										onChange={(e) =>
											setValueRange(e.target.value)
										}
										required
									/>
								</label>
							</div>

							<button
								className="input col-span-3 col-start-2 mt-2 flex justify-center self-center bg-green-500 px-6 py-2 font-semibold text-gray-100 transition-all duration-500 hover:bg-green-600 active:bg-green-400 disabled:cursor-not-allowed disabled:bg-gray-400 max-form:col-span-full"
								disabled={success}
							>
								{presetId ? "Edit" : "Add"}
							</button>
						</form>

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
					</>
				)}
			</div>
		</motion.div>
	);
};

export default Preset;
