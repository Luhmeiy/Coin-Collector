// Context
import { ThemeContext } from "../../context";

// Hooks
import { useUpdate } from "../../hooks";

// Libraries
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";

// React
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ACTIONS } from "../../utils/reducer";

const Navbar = () => {
	const { state, dispatch } = useContext(ThemeContext);

	const update = useUpdate();
	const navigation = useNavigate();

	async function handleDispatch(type: string, value: string) {
		if (type === "mode") {
			document.documentElement.className = "";
			document.documentElement.classList.add(value.split("-")[0]);
			dispatch({ type: ACTIONS.CHANGE_MODE, payload: { mode: value } });
		} else if (type === "theme") {
			dispatch({ type: ACTIONS.CHANGE_THEME, payload: { theme: value } });
		}

		try {
			await update(`users/${state.userUID}`, { [type]: value });
		} catch (error: any) {
			alert(error.message);
		}
	}

	function handleSignOut() {
		localStorage.clear();
		dispatch({
			type: ACTIONS.ADD_USER,
			payload: { user: undefined },
		});

		navigation("/register");
	}

	return (
		<motion.nav
			className="w-[85%] fixed flex justify-end top-0"
			initial={{ translateY: -window.innerHeight }}
			animate={{ translateY: 0 }}
			exit={{ translateY: -window.innerHeight }}
			transition={{
				duration: 0.5,
				ease: "easeInOut",
			}}
		>
			{state.user && (
				<>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger className="bg-black text-white font-semibold px-6 py-2 mr-5">
							Modes
						</DropdownMenu.Trigger>

						<DropdownMenu.Portal>
							<DropdownMenu.Content className="grid grid-cols-2 gap-2 bg-black text-white font-semibold rounded-sm p-2 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
								<button
									onClick={() =>
										handleDispatch("mode", "light-mode")
									}
								>
									Light
								</button>

								<button
									onClick={() =>
										handleDispatch("mode", "dark-mode")
									}
								>
									Dark
								</button>

								<DropdownMenu.Arrow className="fill-black" />
							</DropdownMenu.Content>
						</DropdownMenu.Portal>
					</DropdownMenu.Root>

					<DropdownMenu.Root>
						<DropdownMenu.Trigger className="bg-black text-white font-semibold px-6 py-2 mr-5">
							Themes
						</DropdownMenu.Trigger>

						<DropdownMenu.Portal>
							<DropdownMenu.Content className="grid grid-cols-2 gap-1 bg-black rounded-sm p-2 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
								<button
									className="w-4 h-4 bg-green-theme"
									onClick={() =>
										handleDispatch("theme", "green-theme")
									}
								/>
								<button
									className="w-4 h-4 bg-blue-theme"
									onClick={() =>
										handleDispatch("theme", "blue-theme")
									}
								/>
								<button
									className="w-4 h-4 bg-red-theme"
									onClick={() =>
										handleDispatch("theme", "red-theme")
									}
								/>
								<button
									className="w-4 h-4 bg-yellow-theme"
									onClick={() =>
										handleDispatch("theme", "yellow-theme")
									}
								/>
								<button
									className="w-4 h-4 bg-pink-theme"
									onClick={() =>
										handleDispatch("theme", "pink-theme")
									}
								/>
								<button
									className="w-4 h-4 bg-purple-theme"
									onClick={() =>
										handleDispatch("theme", "purple-theme")
									}
								/>

								<DropdownMenu.Arrow className="fill-black" />
							</DropdownMenu.Content>
						</DropdownMenu.Portal>
					</DropdownMenu.Root>

					<button
						className="bg-black text-white font-semibold px-6 py-2 mr-10"
						onClick={handleSignOut}
					>
						Sign Out
					</button>
				</>
			)}
		</motion.nav>
	);
};

export default Navbar;
