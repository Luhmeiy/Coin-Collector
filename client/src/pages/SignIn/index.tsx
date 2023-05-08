import { GoogleLogo } from "@phosphor-icons/react";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../../context";
import { ACTIONS } from "../../utils/reducer";
import { motion } from "framer-motion";
import { usePost } from "../../hooks/usePost";
import { useGet } from "../../hooks/useGet";

const SignIn = () => {
	const { state, dispatch } = useContext(ThemeContext);

	const post = usePost();
	const navigate = useNavigate();

	const basePresets = useGet("presets").data;

	function handleGoogleSignIn() {
		const provider = new GoogleAuthProvider();

		signInWithPopup(auth, provider)
			.then((res) => {
				searchUsers(res.user);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	async function searchUsers(userData: User) {
		const { uid } = userData;

		await fetch(`${state.serverURL}/users/${uid}`)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				if (data.length > 0) {
					login(uid);
				} else {
					registerUser(userData);
				}
			});
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
			theme: "green-theme",
			mode: "light-mode",
		};

		await post("users", data)
			.then(async () => {
				for (const basePreset of basePresets) {
					await post(`presets/${uid}`, basePreset);
				}
			})
			.then(() => login(uid));
	}

	return (
		<motion.div
			className="w-[85%] h-[85%] flex flex-col justify-center items-center border-8 border-black rounded-2xl p-5 bg-light-mode dark:bg-dark-mode dark:text-white shadow-solid"
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
				className={`flex items-center bg-${state.theme} border-4 border-black rounded text-black py-2 px-6 font-semibold transition-all duration-500 hover:brightness-90`}
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
