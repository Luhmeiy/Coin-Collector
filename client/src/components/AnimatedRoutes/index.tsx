import { Route, Routes, useLocation } from "react-router-dom";
import { EditCoin, Home, SignIn } from "../../pages";
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
				<Route path="/edit/coin/:coinId" element={<EditCoin />} />
			</Routes>
		</AnimatePresence>
	);
};

export default AnimatedRoutes;
