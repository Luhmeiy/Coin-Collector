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

const SignIn = () => {
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
			className="w-[85%] h-[85%] flex flex-col justify-center items-center bg-light-mode dark:bg-dark-mode dark:text-white border-8 border-black rounded-2xl p-5 shadow-solid"
			initial={{ translateY: window.innerHeight }}
			animate={{ translateY: 0 }}
			exit={{ translateY: window.innerHeight }}
			transition={{
				duration: 0.5,
				ease: "easeInOut",
			}}
		>
			<h1 className="text-5xl font-bold mb-2">Coin Collector</h1>
			<p className="text-lg mb-12">Sign in to catalog your coins!</p>

			<button
				className={`flex items-center bg-${state.theme} text-black font-semibold border-4 border-black rounded py-2 px-6 transition-all duration-500 hover:brightness-90`}
				onClick={handleGoogleSignIn}
			>
				<GoogleLogo
					size={18}
					weight="bold"
					alt="Google logo"
					className="mr-2"
				/>{" "}
				Sign in with Google
			</button>
		</motion.div>
	);
};

export default SignIn;
