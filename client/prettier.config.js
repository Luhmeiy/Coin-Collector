module.exports = {
	plugins: [require("prettier-plugin-tailwindcss")],
	overrides: [
		{
			files: ["*.js", "*.ts", "*.tsx", "*.scss"],
			options: {
				tabWidth: 4,
				useTabs: true,
			},
		},
	],
};
