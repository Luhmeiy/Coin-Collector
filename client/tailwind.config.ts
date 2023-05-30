import type { Config } from "tailwindcss";
import tailwindScrollbar from "tailwind-scrollbar";

const plugin = tailwindScrollbar({ nocompatible: true });
const { handler } = plugin;

export default {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				"dark-mode": "#27272a",
				"light-mode": "#f4f4f5",
				"green-theme": "#a5d6b1",
				"blue-theme": "#aed9e0",
				"red-theme": "#eb9988",
				"yellow-theme": "#f4e2a5",
				"pink-theme": "#f1a7b3",
				"purple-theme": "#c7b5e2",
			},
			fontFamily: {
				title: ["Raleway", "sans-serif"],
				montserrat: ["Montserrat", "sans-serif"],
			},
		},
		screens: {
			phone: "450px",
			form: "752px",
			tablet: "880px",
			laptop: "1024px",
		},
	},
	plugins: [handler],
} satisfies Config;
