import express from "express";
import { getData } from "./config/db";

export const router = express();

router.get("/preset_coins", async (req, res) => {
	const orderType = req.query.order || "name";

	const data = await getData("preset_coins", String(orderType));

	return res.send(JSON.stringify(data));
});

router.get("/preset_coins/:id", async (req, res) => {
	const id = req.params.id;

	const data = await getData(`preset_coins`, undefined, id);

	return res.send(JSON.stringify(data));
});

router.get("/:userid/coins", async (req, res) => {
	const orderType = req.query.order || "name";
	const userid = req.params.userid;

	const data = await getData(`users/${userid}/coins`, String(orderType));

	return res.send(JSON.stringify(data));
});

router.get("/:userid/coins/:id", async (req, res) => {
	const userid = req.params.userid;
	const id = req.params.id;

	const data = await getData(`users/${userid}/coins`, undefined, id);

	return res.send(JSON.stringify(data));
});
