import { motion } from "framer-motion";

const FloatingMessage = ({ message }: { message: string }) => {
	return (
		<motion.div
			key="message"
			className={`absolute top-5 z-50 w-[50%] self-center rounded border-2 border-red-400 bg-red-300 px-6 py-8 font-semibold text-red-500`}
			initial={{ translateY: "-12.5rem" }}
			animate={{ translateY: 0 }}
			exit={{ translateY: "-12.5rem" }}
			transition={{
				duration: 0.5,
				ease: "easeInOut",
			}}
		>
			{message}
		</motion.div>
	);
};

export default FloatingMessage;
