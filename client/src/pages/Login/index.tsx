// Context
import { ThemeContext } from "../../context";

// Firebase
import {
	getAuth,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
	User,
} from "firebase/auth";
import { auth } from "../../services/firebase";

// Hooks
import { useGet } from "../../hooks";

// Libraries
import { AnimatePresence, motion } from "framer-motion";
import { GoogleLogo } from "@phosphor-icons/react";

// React
import { FormEvent, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ACTIONS } from "../../utils/reducer";
import { FloatingMessage } from "../../components";

const Login = () => {
	const { state, dispatch } = useContext(ThemeContext);

	const [success, setSuccess] = useState<boolean>(false);
	const [error, setError] = useState<string>();

	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const getData = useGet();
	const navigate = useNavigate();

	async function handleSignIn(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const auth = getAuth();

		setSuccess(true);

		try {
			if (email && password) {
				const userCredential = await signInWithEmailAndPassword(
					auth,
					email,
					password
				);
				const user = userCredential.user;

				searchUsers(user);
			}
		} catch (error) {
			setError("User not registered");
			setTimeout(() => setError(""), 3000);

			setSuccess(false);
		}
	}

	async function handleGoogleSignIn() {
		const provider = new GoogleAuthProvider();

		setSuccess(true);

		try {
			const results = await signInWithPopup(auth, provider);

			searchUsers(results.user);
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
				setTimeout(() => setError(""), 3000);

				setSuccess(false);
			}
		}
	}

	async function searchUsers(userData: User) {
		const { uid } = userData;

		try {
			await getData(`users/${uid}`);

			login(uid);
		} catch (error) {
			setError("User not registered");
			setTimeout(() => setError(""), 3000);

			setSuccess(false);
		}
	}

	async function login(uid: string) {
		localStorage.setItem("userUID", uid);
		dispatch({ type: ACTIONS.ADD_USER_UID, payload: { userUID: uid } });

		navigate("/");
	}

	useEffect(() => {
		if (state.user) {
			navigate("/");
		}
	}, [state.user]);

	return (
		<motion.div
			className="shadow-solid z-10 grid min-h-[65%] w-[85%] grid-cols-2 items-center justify-items-center gap-8 bg-light-mode p-12 dark:bg-dark-mode max-tablet:w-[85%] max-tablet:grid-cols-1 max-phone:p-6"
			initial={{ translateY: window.innerHeight }}
			animate={{ translateY: 0 }}
			exit={{ translateY: window.innerHeight }}
			transition={{
				duration: 0.5,
				ease: "easeInOut",
			}}
		>
			<AnimatePresence>
				{error && <FloatingMessage message={error} />}
			</AnimatePresence>

			<div className="max-tablet:hidden">
				<h1 className="none mb-4 font-title text-[4rem] font-bold uppercase leading-tight max-laptop:text-5xl">
					Coin <br /> Collector
				</h1>
				<p className="mb-4 font-bold">
					Keep track of your coins with ease.
				</p>

				<p>Welcome back, your coins await you!</p>
			</div>

			<div className="flex min-w-[300px] flex-col gap-8 max-phone:min-w-full">
				<h2 className="text-center text-[2rem] font-semibold">Login</h2>

				<form onSubmit={handleSignIn}>
					<div className="mb-8 flex flex-col gap-5">
						<label className="input-container">
							<span>Email</span>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email"
								required
							/>
						</label>

						<label className="input-container">
							<span>Password</span>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter your password"
								required
							/>
						</label>
					</div>

					<div className="flex flex-col gap-4">
						<button
							type="submit"
							className={`flex w-full items-center justify-center bg-${state.theme} input py-2 font-semibold text-gray-800 transition-all duration-500 hover:brightness-90 disabled:cursor-not-allowed disabled:bg-gray-400`}
							disabled={success}
						>
							Login
						</button>

						<hr className="w-[3.125rem] self-center dark:border-zinc-700" />

						<button
							className={`input flex w-full items-center justify-center py-2 font-semibold text-gray-800 transition-all duration-500 hover:bg-black/10 disabled:cursor-not-allowed disabled:bg-gray-400 dark:text-gray-100`}
							onClick={handleGoogleSignIn}
							disabled={success}
						>
							<GoogleLogo
								size={22}
								weight="bold"
								alt="Google logo"
								className="mr-2"
							/>{" "}
							Sign in with Google
						</button>
					</div>
				</form>

				<Link
					to="/register"
					className="text-center font-semibold text-blue-400 transition-all duration-500 hover:text-blue-500"
				>
					Create an account
				</Link>
			</div>
		</motion.div>
	);
};

export default Login;
