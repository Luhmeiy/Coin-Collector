import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { router } from "./routes";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

// Config JSON and form data response
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Solve cors
app.use(
	cors({
		credentials: true,
		origin: process.env.CLIENT_URL,
	})
);

app.use(router);

app.listen(port, () => {
	console.log(`Connected to port ${port}`);
});
