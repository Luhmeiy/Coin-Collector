import { Home, SignIn } from "./pages";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function App() {
	return (
		<div className="h-screen flex items-center justify-center bg-pattern">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/register" element={<SignIn />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

