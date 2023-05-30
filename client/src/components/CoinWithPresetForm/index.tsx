import { FormEvent, useContext, useEffect, useState } from "react";
import { useGet } from "../../hooks";
import { ThemeContext } from "../../context";
import { PresetData } from "../../interfaces/PresetData";
import { motion } from "framer-motion";

interface CoinWithPresetFormProps {
	handleSubmit(e: FormEvent<Element>): Promise<void>;
	success: boolean;
	setError: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const CoinWithPresetForm = ({
	handleSubmit,
	success,
	setError,
}: CoinWithPresetFormProps) => {
	const { state } = useContext(ThemeContext);

	const [loading, setLoading] = useState<boolean>(true);

	const [presets, setPresets] = useState<PresetData[]>();
	const [selectedPreset, setSelectedPreset] = useState<number>(0);

	const [yearRange, setYearRange] = useState<number[]>();

	const [name, setName] = useState<string>("");
	const [symbol, setSymbol] = useState<string>("");
	const [value, setValue] = useState<number>();
	const [year, setYear] = useState<number>();
	const [quantity, setQuantity] = useState<string>("1");

	const getData = useGet();

	async function fetchPresets() {
		try {
			const data = await getData(`presets/${state.userUID}`);

			setPresets(data);
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
				setTimeout(() => setError(""), 3000);
			}
		}
	}

	async function handleSelectedPreset(index: number) {
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
			setQuantity("1");

			setYearRange(
				Array.from(
					{
						length: final_emission_date - initial_emission_date + 1,
					},
					(_, index) => index + initial_emission_date
				)
			);

			setLoading(false);
		}
	}

	useEffect(() => {
		if (!presets) {
			fetchPresets();
		} else {
			handleSelectedPreset(0);
		}
	}, [presets]);

	return (
		<motion.form
			className="grid grid-cols-5 gap-5 py-2 max-form:max-w-[300px] max-form:grid-cols-2"
			onSubmit={(e) => handleSubmit(e)}
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
			exit={{ scale: 0 }}
			transition={{
				duration: 0.5,
				ease: "easeInOut",
			}}
		>
			{!loading && (
				<>
					<div className="col-span-4 max-form:col-span-full">
						<label className="input-container">
							<span>Coin</span>
							<input type="hidden" name="name" value={name} />
							<select
								className="!px-4 !py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={selectedPreset}
								onChange={(e) =>
									handleSelectedPreset(+e.target.value)
								}
								required
							>
								{presets &&
									presets.map((preset, i) => (
										<option value={i} key={preset.id}>
											{preset.name} (
											{preset.initial_emission_date}-
											{preset.final_emission_date})
										</option>
									))}
							</select>
						</label>
					</div>

					<div className="col-span-1">
						<label className="input-container">
							<span>Symbol</span>
							<input
								type="text"
								name="symbol"
								className="!px-4 !py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={symbol}
								onChange={(e) => setSymbol(e.target.value)}
								required
							/>
						</label>
					</div>

					<div className="col-span-2 max-form:col-span-1">
						<label className="input-container">
							<span>Value</span>
							<select
								name="value"
								className="!px-4 !py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={value}
								onChange={(e) => setValue(+e.target.value)}
								required
							>
								{presets &&
									presets[selectedPreset].value_range.map(
										(value) => (
											<option value={value} key={value}>
												{value}
											</option>
										)
									)}
							</select>
						</label>
					</div>

					<div className="col-span-2 max-form:col-span-1">
						<label className="input-container">
							<span>Year</span>
							<select
								name="year"
								className="!px-4 !py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={year}
								onChange={(e) => setYear(+e.target.value)}
								required
							>
								{yearRange &&
									yearRange.map((year) => (
										<option value={year} key={year}>
											{year}
										</option>
									))}
							</select>
						</label>
					</div>

					<div className="col-span-1">
						<label className="input-container">
							<span>Quantity</span>
							<input
								type="number"
								name="quantity"
								className="!px-4 !py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={quantity}
								onChange={(e) => setQuantity(e.target.value)}
								required
							/>
						</label>
					</div>

					<div className="col-span-full">
						<label className="input-container">
							<span>
								Note{" "}
								<span className="!font-normal">(Optional)</span>
							</span>
							<textarea
								name="note"
								className="h-[4.5rem] resize-none !px-4 !py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</label>
					</div>

					<button
						className="input col-span-3 col-start-2 mt-2 flex justify-center self-center bg-green-500 px-6 py-2 font-semibold text-gray-100 transition-all duration-500 hover:bg-green-600 active:bg-green-400 disabled:cursor-not-allowed disabled:bg-gray-400 max-form:col-span-full"
						disabled={success}
					>
						Add
					</button>
				</>
			)}
		</motion.form>
	);
};

export default CoinWithPresetForm;
