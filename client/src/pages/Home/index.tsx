import { useGetUser } from "../../hooks/useGetUser";

const Home = () => {
	const user = useGetUser();

	return (
		<div className="w-[85%] h-[85%] flex flex-col justify-center items-center border-8 border-black rounded-2xl p-5 bg-light-background shadow-solid">
			{user && (
				<>
					<h1 className="text-5xl font-bold mb-2">Coin Collector</h1>
				</>
			)}
		</div>
	);
};

export default Home;
