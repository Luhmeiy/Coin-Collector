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
					className={`flex h-[100dvh] flex-col items-center justify-center overflow-hidden bg-light-mode font-montserrat text-gray-800 dark:bg-dark-mode dark:text-gray-100`}
				>
					<WebTop />
					<AnimatedRoutes />
					<WebBottom />
				</div>
			</ThemeProvider>
		</BrowserRouter>
	);
}
