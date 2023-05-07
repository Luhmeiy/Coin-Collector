import type { Config } from "tailwindcss";

export default {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				"dark-mode": "#615f61",
				"light-mode": "#ece3cd",
				"green-theme": "#acd1bf",
				"blue-theme": "#b7d3d1",
				"red-theme": "#eb9988",
				"yellow-theme": "#ffeec0",
				"pink-theme": "#f4c4c3",
				"purple-theme": "#e4cAfc",
			},
		},
	},
	plugins: [],
} satisfies Config;

