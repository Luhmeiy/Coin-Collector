import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ACTIONS } from "../../utils/reducer";
import { useContext } from "react";
import { ThemeContext } from "../../context";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
	const { state, dispatch } = useContext(ThemeContext);

	const navigation = useNavigate();

	function handleDispatch(typeValue: string) {
		dispatch({ type: ACTIONS.CHANGE_THEME, payload: { theme: typeValue } });
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
		<nav className="w-[85%] flex justify-end fixed top-0">
			{state.user && (
				<>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger className="bg-black text-white font-semibold px-6 py-2 mr-5">
							Themes
						</DropdownMenu.Trigger>

						<DropdownMenu.Portal>
							<DropdownMenu.Content className="grid grid-cols-2 gap-1 bg-black p-2 rounded-sm shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
								<button
									className="w-4 h-4 bg-green-theme"
									onClick={() =>
										handleDispatch("green-theme")
									}
								/>
								<button
									className="w-4 h-4 bg-blue-theme"
									onClick={() => handleDispatch("blue-theme")}
								/>
								<button
									className="w-4 h-4 bg-red-theme"
									onClick={() => handleDispatch("red-theme")}
								/>
								<button
									className="w-4 h-4 bg-yellow-theme"
									onClick={() =>
										handleDispatch("yellow-theme")
									}
								/>
								<button
									className="w-4 h-4 bg-pink-theme"
									onClick={() => handleDispatch("pink-theme")}
								/>
								<button
									className="w-4 h-4 bg-purple-theme"
									onClick={() =>
										handleDispatch("purple-theme")
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
		</nav>
	);
};

export default Navbar;
