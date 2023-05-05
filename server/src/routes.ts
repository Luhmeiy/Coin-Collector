import express from "express";
import {
	deleteData,
	getData,
	postData,
	registerUser,
} from "./controllers/DatabaseController";
import { validate } from "./middlewares/validate";

// Schemas
import { coinSchema } from "./schemas/Coin";
import { presetSchema } from "./schemas/Preset";
import { userSchema } from "./schemas/User";

export const router = express();

router.get("/preset_coins", async (req, res) => {
	const orderType = req.query.order || "name";

	const data = await getData("preset_coins", String(orderType));

	res.send(JSON.stringify(data));
});

router.post("/preset_coins", validate(presetSchema), async (req, res) => {
	const {
		final_emission_date,
		initial_emission_date,
		name,
		symbol,
		value_range,
	} = req.body;

	const presetData = {
		final_emission_date,
		initial_emission_date,
		name,
		symbol,
		value_range,
	};

	const data = await postData("preset_coins", presetData);

	res.send(JSON.stringify(data));
});

router.get("/preset_coins/:id", async (req, res) => {
	const id = req.params.id;

	const data = await getData(`preset_coins`, undefined, id);

	res.send(JSON.stringify(data));
});

router.delete("/preset_coins/:id", async (req, res) => {
	const id = req.params.id;

	const data = await deleteData("preset_coins", id);

	res.send(JSON.stringify(data));
});

router.get("/:userid/coins", async (req, res) => {
	const orderType = req.query.order || "name";
	const userid = req.params.userid;

	const data = await getData(`users/${userid}/coins`, String(orderType));

	res.send(JSON.stringify(data));
});

router.post("/:userid/coins", validate(coinSchema), async (req, res) => {
	const userid = req.params.userid;

	const { name, symbol, value, year } = req.body;

	const coinData = {
		name,
		symbol,
		value,
		year,
	};

	const data = await postData(`users/${userid}/coins`, coinData);

	res.send(JSON.stringify(data));
});

router.get("/:userid/coins/:id", async (req, res) => {
	const userid = req.params.userid;
	const id = req.params.id;

	const data = await getData(`users/${userid}/coins`, undefined, id);

	res.send(JSON.stringify(data));
});

router.delete("/:userid/coins/:id", async (req, res) => {
	const userid = req.params.userid;
	const id = req.params.id;

	const data = await deleteData(`users/${userid}/coins`, id);

	res.send(JSON.stringify(data));
});

router.get("/users/:userid", async (req, res) => {
	const userid = req.params.userid;

	const data = await getData("users", undefined, userid);

	res.send(JSON.stringify(data));
});

router.post("/users", validate(userSchema), async (req, res) => {
	const { uid } = req.body;

	const data = await registerUser(`users`, req.body, uid);

	res.send(JSON.stringify(data));
});
