import { AnimatedRoutes } from "./components";
import ThemeProvider from "./context";
import { BrowserRouter } from "react-router-dom";

export default function App() {
	return (
		<BrowserRouter>
			<ThemeProvider>
				<div className="h-screen flex flex-col items-center justify-center bg-pattern overflow-hidden">
					<AnimatedRoutes />
				</div>
			</ThemeProvider>
		</BrowserRouter>
	);
}

