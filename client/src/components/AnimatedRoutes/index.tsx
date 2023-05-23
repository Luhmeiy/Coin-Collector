// Components / Pages
import { Navbar } from "../";
import { Coin, Home, Login, Preset, Presets, Register } from "../../pages";

// Libraries
import { AnimatePresence } from "framer-motion";

// React
import { Route, Routes, useLocation } from "react-router-dom";

const AnimatedRoutes = () => {
	const location = useLocation();

	return (
		<AnimatePresence mode="wait">
			<Navbar />

			<Routes location={location} key={location.pathname}>
				<Route path="/" element={<Home />} />
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
				<Route path="/presets" element={<Presets />} />
				<Route path="/add/coin" element={<Coin />} />
				<Route path="/add/preset" element={<Preset />} />
				<Route path="/edit/coin/:coinId" element={<Coin />} />
				<Route path="/edit/preset/:presetId" element={<Preset />} />
			</Routes>
		</AnimatePresence>
	);
};

export default AnimatedRoutes;
