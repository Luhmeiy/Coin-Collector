import { motion } from "framer-motion";

interface MessageProps {
	message: string;
	type: "success" | "error";
}

const Message = ({ message, type }: MessageProps) => {
	return (
		<>
			<motion.div
				key="message"
				className={`w-full font-semibold border-2 rounded ${
					type === "success" &&
					"bg-green-300 text-green-600 border-green-400"
				} ${
					type === "error" && "bg-red-300 text-red-500 border-red-400"
				} px-6 py-8 mt-6`}
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
		</>
	);
};

export default Message;
