import express from "express";
import { router } from "./routes";

const app = express();

// Config JSON and form data response
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(router);

app.listen(3000, () => {
	console.log(`Connected to port 3000`);
});
