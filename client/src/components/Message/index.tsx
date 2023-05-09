import { motion } from "framer-motion";

const Message = ({ message }: { message: string }) => {
	return (
		<>
			<motion.div
				key="message"
				className="col-span-5 bg-green-300 border-2 border-green-400 rounded text-green-600 font-semibold px-6 py-8"
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
