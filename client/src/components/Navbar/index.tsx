// Context
import { ThemeContext } from "../../context";

// Hooks
import { useUpdate } from "../../hooks";

// Libraries
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CaretRight } from "@phosphor-icons/react";
import { motion } from "framer-motion";

// React
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
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
		} catch (error) {
			if (error instanceof Error) alert(error.message);
		}
	}

	function handleSignOut() {
		localStorage.clear();
		dispatch({
			type: ACTIONS.ADD_USER,
			payload: { user: undefined },
		});

		navigation("/login");
	}

	return (
		<motion.nav
			className="fixed top-0 w-[85%] px-8 max-phone:px-0"
			initial={{ translateY: -window.innerHeight }}
			animate={{ translateY: 0 }}
			exit={{ translateY: -window.innerHeight }}
			transition={{
				duration: 0.5,
				ease: "easeInOut",
			}}
		>
			{state.user && (
				<div className="flex justify-between max-tablet:hidden">
					<Link
						to="/"
						className="bg-black px-6 py-2 font-title font-semibold uppercase text-gray-100"
					>
						Coin Collector
					</Link>

					<div>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger className="mr-5 bg-black px-6 py-2 font-semibold uppercase text-gray-100">
								Modes
							</DropdownMenu.Trigger>

							<DropdownMenu.Portal>
								<DropdownMenu.Content className="z-20 grid grid-cols-2 gap-2 rounded-sm bg-black p-2 font-semibold text-gray-100 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
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
							<DropdownMenu.Trigger className="mr-5 bg-black px-6 py-2 font-semibold uppercase text-gray-100">
								Themes
							</DropdownMenu.Trigger>

							<DropdownMenu.Portal>
								<DropdownMenu.Content className="z-20 grid grid-cols-2 gap-1 rounded-sm bg-black p-2 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
									<button
										className="h-4 w-4 bg-green-theme"
										onClick={() =>
											handleDispatch(
												"theme",
												"green-theme"
											)
										}
									/>
									<button
										className="h-4 w-4 bg-blue-theme"
										onClick={() =>
											handleDispatch(
												"theme",
												"blue-theme"
											)
										}
									/>
									<button
										className="h-4 w-4 bg-red-theme"
										onClick={() =>
											handleDispatch("theme", "red-theme")
										}
									/>
									<button
										className="h-4 w-4 bg-yellow-theme"
										onClick={() =>
											handleDispatch(
												"theme",
												"yellow-theme"
											)
										}
									/>
									<button
										className="h-4 w-4 bg-pink-theme"
										onClick={() =>
											handleDispatch(
												"theme",
												"pink-theme"
											)
										}
									/>
									<button
										className="h-4 w-4 bg-purple-theme"
										onClick={() =>
											handleDispatch(
												"theme",
												"purple-theme"
											)
										}
									/>

									<DropdownMenu.Arrow className="fill-black" />
								</DropdownMenu.Content>
							</DropdownMenu.Portal>
						</DropdownMenu.Root>

						<button
							className="bg-black px-6 py-2 font-semibold uppercase text-gray-100"
							onClick={handleSignOut}
						>
							Sign Out
						</button>
					</div>
				</div>
			)}

			<div className="hidden w-full justify-between max-tablet:flex">
				<Link
					to={state.user ? "/" : "/login"}
					className="bg-black px-6 py-2 font-title font-semibold uppercase text-gray-100 max-phone:px-3"
				>
					Coin Collector
				</Link>

				{state.user && (
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild>
							<button className="bg-black px-6 py-2 font-semibold uppercase text-gray-100 max-phone:px-3">
								Menu
							</button>
						</DropdownMenu.Trigger>

						<DropdownMenu.Portal>
							<DropdownMenu.Content
								className="z-20 flex flex-col rounded-sm bg-black px-4 py-2 font-semibold text-gray-100 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
								sideOffset={5}
							>
								<DropdownMenu.Sub>
									<DropdownMenu.SubTrigger className="group relative flex h-[25px] select-none items-center rounded-[3px] text-sm leading-none outline-none">
										Modes
										<div className="ml-auto pl-[20px]">
											<CaretRight
												size={16}
												weight="bold"
											/>
										</div>
									</DropdownMenu.SubTrigger>

									<DropdownMenu.Portal>
										<DropdownMenu.SubContent
											className="z-30 flex flex-col gap-1 rounded-sm bg-black p-2 font-semibold text-gray-100 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
											sideOffset={20}
											alignOffset={-7}
										>
											<button
												onClick={() =>
													handleDispatch(
														"mode",
														"light-mode"
													)
												}
											>
												Light
											</button>

											<button
												onClick={() =>
													handleDispatch(
														"mode",
														"dark-mode"
													)
												}
											>
												Dark
											</button>

											<DropdownMenu.Arrow className="fill-black" />
										</DropdownMenu.SubContent>
									</DropdownMenu.Portal>
								</DropdownMenu.Sub>

								<DropdownMenu.Sub>
									<DropdownMenu.SubTrigger className="group relative flex h-[25px] select-none items-center rounded-[3px] text-sm leading-none outline-none">
										Themes
										<div className="ml-auto pl-[20px]">
											<CaretRight
												size={16}
												weight="bold"
											/>
										</div>
									</DropdownMenu.SubTrigger>

									<DropdownMenu.Portal>
										<DropdownMenu.SubContent
											className="z-30 grid grid-cols-2 gap-1 rounded-sm bg-black p-2 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
											sideOffset={20}
											alignOffset={-3}
										>
											<button
												className="h-4 w-4 bg-green-theme"
												onClick={() =>
													handleDispatch(
														"theme",
														"green-theme"
													)
												}
											/>
											<button
												className="h-4 w-4 bg-blue-theme"
												onClick={() =>
													handleDispatch(
														"theme",
														"blue-theme"
													)
												}
											/>
											<button
												className="h-4 w-4 bg-red-theme"
												onClick={() =>
													handleDispatch(
														"theme",
														"red-theme"
													)
												}
											/>
											<button
												className="h-4 w-4 bg-yellow-theme"
												onClick={() =>
													handleDispatch(
														"theme",
														"yellow-theme"
													)
												}
											/>
											<button
												className="h-4 w-4 bg-pink-theme"
												onClick={() =>
													handleDispatch(
														"theme",
														"pink-theme"
													)
												}
											/>
											<button
												className="h-4 w-4 bg-purple-theme"
												onClick={() =>
													handleDispatch(
														"theme",
														"purple-theme"
													)
												}
											/>

											<DropdownMenu.Arrow className="fill-black" />
										</DropdownMenu.SubContent>
									</DropdownMenu.Portal>
								</DropdownMenu.Sub>

								<DropdownMenu.Separator className="my-1 h-px w-1/3 self-center bg-zinc-600" />

								<DropdownMenu.Item
									className="group relative flex h-[25px] select-none items-center justify-center rounded-[3px] text-sm leading-none outline-none"
									asChild
								>
									<button onClick={handleSignOut}>
										Sign Out
									</button>
								</DropdownMenu.Item>

								<DropdownMenu.Arrow className="fill-black" />
							</DropdownMenu.Content>
						</DropdownMenu.Portal>
					</DropdownMenu.Root>
				)}
			</div>
		</motion.nav>
	);
};

export default Navbar;
