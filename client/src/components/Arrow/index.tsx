import { ArrowFatDown, ArrowFatUp } from "@phosphor-icons/react";

const Arrow = ({ direction }: { direction: boolean }) => {
	return (
		<>
			{direction ? (
				<ArrowFatUp
					weight="bold"
					className="w-[1.125rem] max-tablet:w-4"
				/>
			) : (
				<ArrowFatDown
					weight="bold"
					className="w-[1.125rem] max-tablet:w-4"
				/>
			)}
		</>
	);
};

export default Arrow;
