// Context
import { ThemeContext } from "../../context";

// Firebase
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { auth } from "../../services/firebase";

// Hooks
import { useGet, usePost } from "../../hooks";

// Libraries
import { motion } from "framer-motion";
import { GoogleLogo } from "@phosphor-icons/react";

// React
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ACTIONS } from "../../utils/reducer";

const Register = () => {
	const { state, dispatch } = useContext(ThemeContext);

	const getData = useGet();
	const post = usePost();
	const navigate = useNavigate();

	async function handleGoogleSignIn() {
		const provider = new GoogleAuthProvider();

		try {
			const results = await signInWithPopup(auth, provider);

			searchUsers(results.user);
		} catch (error: any) {
			alert(error);
		}
	}

	async function searchUsers(userData: User) {
		const { uid } = userData;

		try {
			await getData(`users/${uid}`);

			login(uid);
		} catch (error: any) {
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

		const data = {
			uid,
			email,
			displayName,
			photoURL,
		};

		try {
			const basePresets = await getData(`presets`);

			await post("users", data);

			for (const basePreset of basePresets) {
				await post(`presets/${uid}`, basePreset);
			}

			login(uid);
		} catch (error: any) {
			alert(error.message);
		}
	}

	useEffect(() => {
		if (state.user) {
			navigate("/");
		}
	}, [state.user]);

	return (
		<motion.div
			className="w-[85%] min-h-[65%] grid grid-cols-2 items-center justify-items-center bg-light-mode dark:bg-dark-mode container p-24 z-10"
			initial={{ translateY: window.innerHeight }}
			animate={{ translateY: 0 }}
			exit={{ translateY: window.innerHeight }}
			transition={{
				duration: 0.5,
				ease: "easeInOut",
			}}
		>
			<div>
				<h1 className="text-[4rem] font-title font-bold mb-4 uppercase leading-tight">
					Coin <br /> Collector
				</h1>
				<p className="font-bold mb-4">
					Keep track of your coins with ease.
				</p>

				<p> Coin Collector allows you to:</p>
				<ul className="list-disc pl-5">
					<li>Seamlessly manage your coin inventory</li>
					<li> Add coins using custom presets </li>
					<li>Customize the layout to your liking</li>
				</ul>
			</div>

			<div className="flex flex-col gap-8">
				<h2 className="font-semibold text-[2rem]">Create an account</h2>

				<div className="flex flex-col gap-5">
					<label className="input_container">
						<span>Name</span>
						<input type="text" placeholder="Enter your name" />
					</label>

					<label className="input_container">
						<span>Email</span>
						<input type="text" placeholder="Enter your email" />
					</label>

					<label className="input_container">
						<span>Password</span>
						<input type="text" placeholder="Enter your password" />
					</label>
				</div>

				<div className="flex flex-col gap-4">
					<button
						className={`flex w-full justify-center items-center bg-${state.theme} text-gray-800 font-semibold input py-2 transition-all duration-500 hover:brightness-90`}
						onClick={handleGoogleSignIn}
					>
						Create Account
					</button>

					<hr className="w-[3.125rem] self-center dark:border-zinc-700" />

					<button
						className={`flex w-full justify-center items-center text-black font-semibold input py-2 transition-all duration-500 hover:brightness-90 dark:text-gray-100`}
						onClick={handleGoogleSignIn}
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
			</div>
		</motion.div>
	);
};

export default Register;
