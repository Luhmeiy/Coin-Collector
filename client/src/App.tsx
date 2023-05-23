import WebBottom from "./assets/WebBottom";
import WebTop from "./assets/WebTop";
import { AnimatedRoutes } from "./components";
import ThemeProvider from "./context";
import { BrowserRouter } from "react-router-dom";

export default function App() {
	return (
		<BrowserRouter>
			<ThemeProvider>
				<div
					className={`h-screen flex flex-col items-center justify-center bg-light-mode text-gray-800 font-montserrat dark:bg-dark-mode dark:text-gray-100 overflow-hidden`}
				>
					<WebTop />
					<AnimatedRoutes />
					<WebBottom />
				</div>
			</ThemeProvider>
		</BrowserRouter>
	);
}

