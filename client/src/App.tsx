import { Navbar } from "./components";
import { ThemeProvider } from "./context";
import { Home, SignIn } from "./pages";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function App() {
	return (
		<BrowserRouter>
			<ThemeProvider>
				<div className="h-screen flex flex-col items-center justify-center bg-pattern">
					<Navbar />

					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/register" element={<SignIn />} />
					</Routes>
				</div>
			</ThemeProvider>
		</BrowserRouter>
	);
}

