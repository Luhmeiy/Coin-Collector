import { Route, Routes, useLocation } from "react-router-dom";
import { Coin, EditPreset, Home, Presets, SignIn } from "../../pages";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "../";

const AnimatedRoutes = () => {
	const location = useLocation();

	return (
		<AnimatePresence mode="wait">
			<Navbar />

			<Routes location={location} key={location.pathname}>
				<Route path="/" element={<Home />} />
				<Route path="/register" element={<SignIn />} />
				<Route path="/presets" element={<Presets />} />
				<Route path="/add/coin" element={<Coin />} />
				<Route path="/add/preset" element={<EditPreset />} />
				<Route path="/edit/coin/:coinId" element={<Coin />} />
				<Route path="/edit/preset/:presetId" element={<EditPreset />} />
			</Routes>
		</AnimatePresence>
	);
};

export default AnimatedRoutes;
