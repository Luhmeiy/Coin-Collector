import { ArrowFatDown, ArrowFatUp } from "@phosphor-icons/react";

const Arrow = ({ direction }: { direction: boolean }) => {
	return (
		<>
			{direction ? (
				<ArrowFatUp size={18} weight="bold" />
			) : (
				<ArrowFatDown size={18} weight="bold" />
			)}
		</>
	);
};

export default Arrow;
