import { FormEvent, useContext, useEffect, useState } from "react";
import { useGet } from "../../hooks";
import { ThemeContext } from "../../context";
import { motion } from "framer-motion";

interface CoinFormProps {
	handleSubmit(e: FormEvent<Element>): Promise<void>;
	success: boolean;
	setError: React.Dispatch<React.SetStateAction<string | undefined>>;
	coinId?: string;
}

const CoinForm = ({
	handleSubmit,
	success,
	setError,
	coinId,
}: CoinFormProps) => {
	const { state } = useContext(ThemeContext);

	const [loading, setLoading] = useState<boolean>(true);

	const [name, setName] = useState<string>("");
	const [symbol, setSymbol] = useState<string>("");
	const [value, setValue] = useState<string>("");
	const [year, setYear] = useState<string>("");
	const [quantity, setQuantity] = useState<string>("");
	const [note, setNote] = useState<string>("");

	const getData = useGet();

	async function fetchCoin() {
		try {
			const data = await getData(`coins/${state.userUID}/coin/${coinId}`);

			setName(data[0].name);
			setSymbol(data[0].symbol);
			setValue(data[0].value);
			setYear(data[0].year);
			setQuantity(data[0].quantity);
			setNote(data[0].note || "");

			setLoading(false);
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
				setTimeout(() => setError(""), 3000);
			}
		}
	}

	useEffect(() => {
		if (coinId) {
			fetchCoin();
		} else {
			setLoading(false);
		}
	}, []);

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
							<span>Name</span>
							<input
								type="text"
								name="name"
								className="!px-4 !py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
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
							<input
								type="number"
								name="value"
								className="!px-4 !py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={value}
								onChange={(e) => setValue(e.target.value)}
								required
							/>
						</label>
					</div>

					<div className="col-span-2 max-form:col-span-1">
						<label className="input-container">
							<span>Year</span>
							<input
								type="number"
								name="year"
								className="!px-4 !py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={year}
								onChange={(e) => {
									if (e.target.value.length <= 4) {
										setYear(e.target.value);
									}
								}}
								required
							/>
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
								value={note}
								onChange={(e) => setNote(e.target.value)}
							/>
						</label>
					</div>

					<button
						className="input col-span-3 col-start-2 mt-2 flex justify-center self-center bg-green-500 px-6 py-2 font-semibold text-gray-100 transition-all duration-500 hover:bg-green-600 active:bg-green-400 disabled:cursor-not-allowed disabled:bg-gray-400 max-form:col-span-full"
						disabled={success}
					>
						{coinId ? "Edit" : "Add"}
					</button>
				</>
			)}
		</motion.form>
	);
};

export default CoinForm;
