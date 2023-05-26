// Context
import { ThemeContext } from "../../context";

// Firebase
import {
	createUserWithEmailAndPassword,
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	User,
} from "firebase/auth";
import { auth } from "../../services/firebase";

// Hooks
import { useGet, usePost } from "../../hooks";

// Libraries
import { motion } from "framer-motion";
import { GoogleLogo } from "@phosphor-icons/react";

// React
import { FormEvent, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ACTIONS } from "../../utils/reducer";

interface UserData {
	uid: string;
	email: string | null;
	displayName: string;
	photoURL: string;
	password?: string;
}

const Register = () => {
	const { state, dispatch } = useContext(ThemeContext);

	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const getData = useGet();
	const post = usePost();
	const navigate = useNavigate();

	async function handleSignUp(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const auth = getAuth();

		try {
			if (email && password) {
				const userCredential = await createUserWithEmailAndPassword(
					auth,
					email,
					password
				);
				const user = userCredential.user;

				searchUsers(user);
			}
		} catch (error) {
			alert("User already registered");
		}
	}

	async function handleGoogleSignUp() {
		const provider = new GoogleAuthProvider();

		try {
			const results = await signInWithPopup(auth, provider);

			searchUsers(results.user);
		} catch (error) {
			if (error instanceof Error) alert(error);
		}
	}

	async function searchUsers(userData: User) {
		const { uid } = userData;

		try {
			await getData(`users/${uid}`);

			login(uid);
		} catch (error) {
			registerUser(userData);
		}
	}

	async function login(uid: string) {
		localStorage.setItem("userUID", uid);
		dispatch({ type: ACTIONS.ADD_USER_UID, payload: { userUID: uid } });

		navigate("/");
	}

	async function registerUser(userData: User) {
		const { uid, email, displayName, photoURL } = userData;

		const data: UserData = {
			uid,
			email,
			displayName: displayName || name,
			photoURL:
				photoURL ||
				"https://images.unsplash.com/photo-1543466835-00a7907e9de1",
		};

		if (password) {
			data.password = password;
		}

		try {
			const basePresets = await getData(`presets`);

			await post("users", data);

			for (const basePreset of basePresets) {
				await post(`presets/${uid}`, basePreset);
			}

			login(uid);
		} catch (error) {
			if (error instanceof Error) alert(error.message);
		}
	}

	useEffect(() => {
		if (state.user) {
			navigate("/");
		}
	}, [state.user]);

	return (
		<motion.div
			className="shadow-solid z-10 grid min-h-[65%] w-[85%] grid-cols-2 items-center justify-items-center bg-light-mode p-24 dark:bg-dark-mode"
			initial={{ translateY: window.innerHeight }}
			animate={{ translateY: 0 }}
			exit={{ translateY: window.innerHeight }}
			transition={{
				duration: 0.5,
				ease: "easeInOut",
			}}
		>
			<div>
				<h1 className="mb-4 font-title text-[4rem] font-bold uppercase leading-tight">
					Coin
					<br /> Collector
				</h1>
				<p className="mb-4 font-bold">
					Keep track of your coins with ease.
				</p>

				<p>Coin Collector allows you to:</p>
				<ul className="list-disc pl-5">
					<li>Seamlessly manage your coin inventory</li>
					<li>Add coins using custom presets</li>
					<li>Customize the layout to your liking</li>
				</ul>
			</div>

			<div className="flex flex-col gap-8">
				<h2 className="text-center text-[2rem] font-semibold">
					Create an account
				</h2>

				<form onSubmit={handleSignUp}>
					<div className="mb-8 flex flex-col gap-5">
						<label className="input-container">
							<span>Name</span>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Enter your name"
								required
							/>
						</label>

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
							className={`flex w-full items-center justify-center bg-${state.theme} input py-2 font-semibold text-gray-800 transition-all duration-500 hover:brightness-90`}
						>
							Create Account
						</button>

						<hr className="w-[3.125rem] self-center dark:border-zinc-700" />

						<button
							className={`input flex w-full items-center justify-center py-2 font-semibold text-gray-800 transition-all duration-500 hover:bg-black/10 dark:text-gray-100`}
							onClick={handleGoogleSignUp}
						>
							<GoogleLogo
								size={22}
								weight="bold"
								alt="Google logo"
								className="mr-2"
							/>{" "}
							Sign up with Google
						</button>
					</div>
				</form>

				<p className="text-center">
					Already an user?{" "}
					<Link
						to="/login"
						className="font-semibold text-blue-400 transition-all duration-500 hover:text-blue-500"
					>
						Login
					</Link>
				</p>
			</div>
		</motion.div>
	);
};

export default Register;
