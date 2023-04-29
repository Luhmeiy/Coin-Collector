import { GoogleLogo } from "@phosphor-icons/react";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { auth } from "../../services/firebase";

const SignIn = () => {
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

		await fetch(`http://localhost:3000/users/${uid}`)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				if (data.length > 0) {
					console.log("Login");
				} else {
					registerUser(userData);
				}
			});
	}

	async function registerUser(userData: User) {
		const { uid, email, displayName, photoURL } = userData;

		const data = {
			uid,
			email,
			displayName,
			photoURL,
		};

		fetch("http://localhost:3000/users", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(data),
		});
	}

	return (
		<div className="w-[85%] h-[85%] flex flex-col justify-center items-center border-8 border-black rounded-2xl p-5 bg-[#f5efe3] shadow-solid">
			<h1 className="text-5xl font-bold mb-2">Coin Collector</h1>
			<p className="text-lg mb-12">Sign in to catalog your coins!</p>

			<button
				className="flex items-center bg-[#acd1bf] border-4 border-black rounded py-2 px-6 font-semibold transition-all duration-500 hover:brightness-90"
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
		</div>
	);
};

export default SignIn;
