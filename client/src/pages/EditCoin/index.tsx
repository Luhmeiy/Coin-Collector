import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FormEvent, useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../context";
import { X } from "@phosphor-icons/react";
import { useUpdate } from "../../hooks/useUpdate";
import { useGet } from "../../hooks/useGet";

const EditCoin = () => {
	const { coinId } = useParams();
	const { state } = useContext(ThemeContext);

	const update = useUpdate();
	const { data, error } = useGet(`coins/${state.userUID}/coin/${coinId}`);

	const [loading, setLoading] = useState(true);
	const [name, setName] = useState<string>();
	const [symbol, setSymbol] = useState<string>();
	const [value, setValue] = useState<number>();
	const [year, setYear] = useState<number>();
	const [quantity, setQuantity] = useState<number>();

	const navigate = useNavigate();

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();

		const data = {
			name,
			symbol,
			value,
			year,
			quantity,
		};

		await update(`coins/${state.userUID}/coin/${coinId}`, data)
			.then(() => navigate("/"))
			.catch((error) => console.log(error));
	}

	useEffect(() => {
		if (data) {
			setName(data[0].name);
			setSymbol(data[0].symbol);
			setValue(data[0].value);
			setYear(data[0].year);
			setQuantity(data[0].quantity);

			setLoading(false);
		}
	}, [data]);

	if (error) console.log(error);
	if (loading) <p>Loading...</p>;

	return (
		<motion.div
			className={`w-[85%] h-[85%] flex flex-col items-center justify-center relative border-8 border-black rounded-2xl bg-light-mode dark:bg-dark-mode dark:text-white shadow-solid`}
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
					Edit Coin
				</h1>

				{!loading && (
					<form
						className="grid grid-cols-5 gap-5"
						onSubmit={(e) => handleSubmit(e)}
					>
						<div className="col-span-4">
							<label className="block mb-2 text-md font-semibold dark:text-white">
								Name
							</label>
							<input
								type="text"
								id="name"
								className="w-full block bg-gray-50 dark:bg-slate-600 border border-gray-300 p-3 dark:border-gray-600 rounded-md text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>

						<div className="col-span-1">
							<label className="block mb-2 text-md font-semibold dark:text-white">
								Symbol
							</label>
							<input
								type="text"
								id="symbol"
								className="w-full block bg-gray-50 dark:bg-slate-600 border border-gray-300 p-3 dark:border-gray-600 rounded-md text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={symbol}
								onChange={(e) => setSymbol(e.target.value)}
								required
							/>
						</div>

						<div className="col-span-2">
							<label className="block mb-2 text-md font-semibold dark:text-white">
								Value
							</label>
							<input
								type="number"
								id="value"
								className="w-full block bg-gray-50 dark:bg-slate-600 border border-gray-300 p-3 dark:border-gray-600 rounded-md text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={value}
								onChange={(e) =>
									setValue(Number(e.target.value))
								}
								required
							/>
						</div>

						<div className="col-span-2">
							<label className="block mb-2 text-md font-semibold dark:text-white">
								Year
							</label>
							<input
								type="number"
								id="year"
								className="w-full block bg-gray-50 dark:bg-slate-600 border border-gray-300 p-3 dark:border-gray-600 rounded-md text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={year}
								onChange={(e) =>
									setYear(Number(e.target.value))
								}
								required
							/>
						</div>

						<div className="col-span-1">
							<label className="block mb-2 text-md font-semibold dark:text-white">
								Quantity
							</label>
							<input
								type="text"
								id="quantity"
								className="w-full block bg-gray-50 dark:bg-slate-600 border border-gray-300 p-3 dark:border-gray-600 rounded-md text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={quantity}
								onChange={(e) =>
									setQuantity(Number(e.target.value))
								}
								required
							/>
						</div>

						<button className="col-start-2 col-span-3 flex justify-center self-center bg-green-500 text-white font-semibold rounded-md px-6 py-2 mt-2 hover:bg-green-600 active:bg-green-400">
							Edit
						</button>
					</form>
				)}
			</div>
		</motion.div>
	);
};

export default EditCoin;
