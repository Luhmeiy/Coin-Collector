import { Route, Routes, useLocation } from "react-router-dom";
import { EditCoin, EditPreset, Home, Presets, SignIn } from "../../pages";
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
				<Route path="/edit/coin/:coinId" element={<EditCoin />} />
				<Route path="/edit/preset/:presetId" element={<EditPreset />} />
			</Routes>
		</AnimatePresence>
	);
};

export default AnimatedRoutes;
