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

type DirectionTypeProps = "asc" | "desc";

router.get("/", async (req, res) => {
	const orderType = req.query.order || "name";

	const data = await getData("preset_coins", String(orderType));

	res.send(JSON.stringify(data));
});

router.get("/:userid", async (req, res) => {
	const userid = req.params.userid;
	const directionType: DirectionTypeProps =
		(req.query.direction as DirectionTypeProps) || "asc";
	const orderType = req.query.order || "name";

	const data = await getData(
		`users/${userid}/presets`,
		String(orderType),
		directionType
	);

	res.send(JSON.stringify(data));
});

router.post("/:userid", validate(presetSchema), async (req, res) => {
	const userid = req.params.userid;

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

	const data = await postData(`users/${userid}/presets`, presetData);

	res.send(JSON.stringify(data));
});

router.get("/:userid/preset/:id", async (req, res) => {
	const userid = req.params.userid;
	const id = req.params.id;

	const data = await getData(
		`users/${userid}/presets`,
		undefined,
		undefined,
		id
	);

	res.send(JSON.stringify(data));
});

router.delete("/:userid/preset/:id", async (req, res) => {
	const userid = req.params.userid;
	const id = req.params.id;

	const data = await deleteData(`users/${userid}/presets`, id);

	res.send(JSON.stringify(data));
});

router.put("/:userid/preset/:id", validate(presetSchema), async (req, res) => {
	const userid = req.params.userid;
	const id = req.params.id;

	const data = await updateData(`users/${userid}/presets`, id, req.body);

	res.send(JSON.stringify(data));
});
