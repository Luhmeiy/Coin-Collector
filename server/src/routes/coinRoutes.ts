import express from "express";
import {
	deleteData,
	getData,
	postData,
	updateData,
	verifyIfCoinExists,
} from "../controllers/DatabaseController";
import { validate } from "../middlewares/validate";
import { coinSchema } from "../schemas/Coin";

export const router = express.Router();

type DirectionTypeProps = "asc" | "desc";

router.get("/:userid", async (req, res) => {
	const orderType = req.query.order || "name";
	const directionType: DirectionTypeProps =
		(req.query.direction as DirectionTypeProps) || "asc";
	const userid = req.params.userid;

	const data = await getData(
		`users/${userid}/coins`,
		String(orderType),
		directionType
	);

	res.send(JSON.stringify(data));
});

router.post("/:userid", validate(coinSchema), async (req, res) => {
	const userid = req.params.userid;

	const { name, symbol, value, year, quantity } = req.body;

	const coinData = {
		name,
		symbol,
		value,
		year,
		quantity,
	};

	verifyIfCoinExists(`users/${userid}/coins`, coinData).then(
		async (results) => {
			if (results.length > 0) {
				const { id, quantity } = results[0];

				const data = await updateData(`users/${userid}/coins`, id, {
					quantity: quantity + 1,
				});

				res.send(JSON.stringify(data));
			} else {
				const data = await postData(`users/${userid}/coins`, coinData);

				res.send(JSON.stringify(data));
			}
		}
	);
});

router.get("/:userid/coin/:id", async (req, res) => {
	const userid = req.params.userid;
	const id = req.params.id;

	const data = await getData(
		`users/${userid}/coins`,
		undefined,
		undefined,
		id
	);

	res.send(JSON.stringify(data));
});

router.delete("/:userid/coin/:id", async (req, res) => {
	const userid = req.params.userid;
	const id = req.params.id;

	const data = await deleteData(`users/${userid}/coins`, id);

	res.send(JSON.stringify(data));
});

router.put("/:userid/coin/:id", validate(coinSchema), async (req, res) => {
	const userid = req.params.userid;
	const id = req.params.id;

	if (req.body.id) {
		delete req.body.id;
	}

	await updateData(`users/${userid}/coins`, id, req.body)
		.then(
			async () =>
				await verifyIfCoinExists(`users/${userid}/coins`, req.body)
		)
		.then(async (results: any) => {
			if (results.length > 1) {
				const { id, quantity } = results.filter(
					(result: any) => result.id !== req.params.id && result
				)[0];

				await deleteData(`users/${userid}/coins`, req.params.id);

				const data = await updateData(`users/${userid}/coins`, id, {
					quantity: quantity + req.body.quantity,
				});

				res.send(JSON.stringify(data));
			} else {
				res.send(JSON.stringify(results.data));
			}
		});
});
