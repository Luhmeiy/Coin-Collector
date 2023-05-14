import express from "express";
import {
	deleteData,
	getData,
	postData,
	updateData,
} from "../controllers/DatabaseController";
import { validate } from "../middlewares/validate";
import { presetSchema } from "../schemas/Preset";
import { DirectionTypeProps } from "DirectionTypeProps";

export const router = express.Router();

router.get("/", async (req, res) => {
	const orderType = (req.query.order as string) || "name";
	const directionType = (req.query.direction as DirectionTypeProps) || "asc";

	try {
		const data = await getData("preset_coins", orderType, directionType);
		res.send(JSON.stringify(data));
	} catch (error) {
		res.status(500).send(JSON.stringify({ error: error.message }));
	}
});

router.get("/:userid", async (req, res) => {
	const userid = req.params.userid;
	const orderType = (req.query.order as string) || "name";
	const directionType = (req.query.direction as DirectionTypeProps) || "asc";

	try {
		const data = await getData(
			`users/${userid}/presets`,
			orderType,
			directionType
		);
		res.send(JSON.stringify(data));
	} catch (error) {
		res.status(500).send(JSON.stringify({ error: error.message }));
	}
});

router.post("/:userid", validate(presetSchema), async (req, res) => {
	const userid = req.params.userid;
	const presetData = req.body;

	try {
		const data = await postData(`users/${userid}/presets`, presetData);
		res.send(JSON.stringify(data));
	} catch (error) {
		res.status(500).send(JSON.stringify({ error: error.message }));
	}
});

router.get("/:userid/preset/:id", async (req, res) => {
	const userid = req.params.userid;
	const id = req.params.id;

	try {
		const data = await getData(
			`users/${userid}/presets`,
			undefined,
			undefined,
			id
		);
		res.send(JSON.stringify(data));
	} catch (error) {
		res.status(500).send(JSON.stringify({ error: error.message }));
	}
});

router.put("/:userid/preset/:id", validate(presetSchema), async (req, res) => {
	const userid = req.params.userid;
	const id = req.params.id;

	try {
		const data = await updateData(`users/${userid}/presets`, id, req.body);
		res.send(JSON.stringify(data));
	} catch (error) {
		res.status(500).send(JSON.stringify({ error: error.message }));
	}
});

router.delete("/:userid/preset/:id", async (req, res) => {
	const userid = req.params.userid;
	const id = req.params.id;

	try {
		const data = await deleteData(`users/${userid}/presets`, id);
		res.send(JSON.stringify(data));
	} catch (error) {
		res.status(500).send(JSON.stringify({ error: error.message }));
	}
});
