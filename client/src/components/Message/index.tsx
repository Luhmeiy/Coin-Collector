import { motion } from "framer-motion";

interface MessageProps {
	message: string;
	type: "success" | "error";
}

const Message = ({ message, type }: MessageProps) => {
	return (
		<motion.div
			key="message"
			className={`w-full rounded border-2 font-semibold ${
				type === "success" &&
				"border-green-400 bg-green-300 text-green-600"
			} ${
				type === "error" && "border-red-400 bg-red-300 text-red-500"
			} mt-6 px-6 py-8`}
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
			exit={{ scale: 0 }}
			transition={{
				duration: 0.5,
				ease: "easeInOut",
			}}
		>
			{message}
		</motion.div>
	);
};

export default Message;
