// Components
import { CoinForm, CoinWithPresetForm, Message } from "../../components";

// Context
import { ThemeContext } from "../../context";

// Hooks
import { usePost, useUpdate } from "../../hooks";

// Interfaces
import { CoinData } from "../../interfaces/CoinData";

// Libraries
import { AnimatePresence, motion } from "framer-motion";
import { X } from "@phosphor-icons/react";

// React
import { FormEvent, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface InputData {
	value: string;
}

interface FormData extends EventTarget {
	name: InputData;
	symbol: InputData;
	value: InputData;
	year: InputData;
	quantity: InputData;
	note: InputData;
}

const Coin = () => {
	const { coinId } = useParams();
	const { state } = useContext(ThemeContext);

	const post = usePost();
	const update = useUpdate();

	const [success, setSuccess] = useState<boolean>(false);
	const [error, setError] = useState<string>();

	const [presetUse, setPresetUse] = useState<boolean>(false);

	const navigate = useNavigate();

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const target = e.target as FormData;

		const name = target.name.value;
		const symbol = target.symbol.value;
		const value = +target.value.value;
		const year = +target.year.value;
		const quantity = +target.quantity.value;
		const note = target.note.value;

		if (quantity < 1) {
			setError("Quantity should be greater than 1");
			setTimeout(() => setError(""), 3000);

			return;
		}

		const data: CoinData = {
			name,
			symbol,
			value,
			year,
			quantity,
		};

		if (note) {
			data.note = note;
		}

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
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
				setTimeout(() => setError(""), 3000);
			}
		}
	}

	return (
		<motion.div
			className="shadow-solid relative z-10 flex min-h-[85%] w-[85%] flex-col items-center justify-center bg-light-mode py-3 dark:bg-dark-mode dark:text-gray-100"
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
				onClick={() => navigate("/")}
			>
				<X size={24} weight="bold" />
			</button>

			<div className="flex w-[50%] flex-col items-center gap-6 max-laptop:w-[75%] max-form:gap-3">
				<h1 className="text-[4rem] font-bold max-form:text-[2rem]">
					{coinId ? "Edit" : "Add"} Coin
				</h1>

				{!coinId && (
					<button
						className={`bg-${state.theme} input w-auto px-5 py-2 font-semibold text-gray-800 hover:brightness-90 active:brightness-110`}
						onClick={() => setPresetUse(!presetUse)}
					>
						{!presetUse ? "Use Preset" : "Cancel"}
					</button>
				)}

				<AnimatePresence mode="wait">
					{!presetUse ? (
						<CoinForm
							handleSubmit={handleSubmit}
							success={success}
							setError={setError}
							coinId={coinId}
						/>
					) : (
						<CoinWithPresetForm
							handleSubmit={handleSubmit}
							success={success}
							setError={setError}
						/>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{success && (
						<Message
							message={`Coin ${
								coinId ? "edited" : "added"
							} successfully`}
							type="success"
						/>
					)}
					{error && <Message message={error} type="error" />}
				</AnimatePresence>
			</div>
		</motion.div>
	);
};

export default Coin;
