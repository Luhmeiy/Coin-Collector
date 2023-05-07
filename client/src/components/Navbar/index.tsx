import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ACTIONS } from "../../utils/reducer";
import { useContext } from "react";
import { ThemeContext } from "../../context";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUpdateUser } from "../../utils/updateUser";

const Navbar = () => {
	const { state, dispatch } = useContext(ThemeContext);
	const updateUser = useUpdateUser();

	const navigation = useNavigate();

	function handleModeDispatch(typeValue: string) {
		document.documentElement.className = "";
		document.documentElement.classList.add(typeValue.split("-")[0]);
		dispatch({ type: ACTIONS.CHANGE_MODE, payload: { mode: typeValue } });

		updateUser({ mode: typeValue });
	}

	function handleThemeDispatch(typeValue: string) {
		dispatch({ type: ACTIONS.CHANGE_THEME, payload: { theme: typeValue } });

		updateUser({ theme: typeValue });
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
			className="w-[85%] flex justify-end fixed top-0"
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
							<DropdownMenu.Content className="grid grid-cols-2 gap-2 bg-black text-white font-semibold p-2 rounded-sm shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
								<button
									onClick={() =>
										handleModeDispatch("light-mode")
									}
								>
									Light
								</button>

								<button
									onClick={() =>
										handleModeDispatch("dark-mode")
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
							<DropdownMenu.Content className="grid grid-cols-2 gap-1 bg-black p-2 rounded-sm shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
								<button
									className="w-4 h-4 bg-green-theme"
									onClick={() =>
										handleThemeDispatch("green-theme")
									}
								/>
								<button
									className="w-4 h-4 bg-blue-theme"
									onClick={() =>
										handleThemeDispatch("blue-theme")
									}
								/>
								<button
									className="w-4 h-4 bg-red-theme"
									onClick={() =>
										handleThemeDispatch("red-theme")
									}
								/>
								<button
									className="w-4 h-4 bg-yellow-theme"
									onClick={() =>
										handleThemeDispatch("yellow-theme")
									}
								/>
								<button
									className="w-4 h-4 bg-pink-theme"
									onClick={() =>
										handleThemeDispatch("pink-theme")
									}
								/>
								<button
									className="w-4 h-4 bg-purple-theme"
									onClick={() =>
										handleThemeDispatch("purple-theme")
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
