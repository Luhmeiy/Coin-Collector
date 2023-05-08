import express from "express";
import {
	deleteData,
	getData,
	postData,
	updateData,
} from "../controllers/DatabaseController";
import { validate } from "../middlewares/validate";
import { presetSchema } from "../schemas/Preset";

export const router = express.Router();

router.get("/", async (req, res) => {
	const orderType = req.query.order || "name";

	const data = await getData("preset_coins", String(orderType));

	res.send(JSON.stringify(data));
});

router.post("/", validate(presetSchema), async (req, res) => {
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

router.get("/:id", async (req, res) => {
	const id = req.params.id;

	const data = await getData(`preset_coins`, undefined, id);

	res.send(JSON.stringify(data));
});

router.delete("/:id", async (req, res) => {
	const id = req.params.id;

	const data = await deleteData("preset_coins", id);

	res.send(JSON.stringify(data));
});

router.put("/:id", validate(presetSchema), async (req, res) => {
	const id = req.params.id;

	const data = await updateData("preset_coins", id, req.body);

	res.send(JSON.stringify(data));
});
