import express from "express";
import { router } from "./routes";

const app = express();

const port = process.env.PORT || 3000;

// Config JSON and form data response
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(router);

app.listen(port, () => {
	console.log(`Connected to port ${port}`);
});
