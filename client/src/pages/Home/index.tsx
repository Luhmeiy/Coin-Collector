import { useContext } from "react";
import { ThemeContext } from "../../context";
import { motion } from "framer-motion";

const Home = () => {
	const { state } = useContext(ThemeContext);

	return (
		<motion.div
			className="w-[85%] h-[85%] flex flex-col justify-center items-center border-8 border-black rounded-2xl p-5 bg-light-background shadow-solid"
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
					<h1 className="text-5xl font-bold mb-2">Coin Collector</h1>
				</>
			)}
		</motion.div>
	);
};

export default Home;
