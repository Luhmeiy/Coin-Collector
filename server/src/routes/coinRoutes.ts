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
import { DirectionTypeProps } from "DirectionTypeProps";

export const router = express.Router();

router.get("/:userid", async (req, res) => {
	const orderType = (req.query.order as string) || "name";
	const directionType = (req.query.direction as DirectionTypeProps) || "asc";
	const userid = req.params.userid;

	try {
		const data = await getData(
			`users/${userid}/coins`,
			orderType,
			directionType
		);
		res.send(JSON.stringify(data));
	} catch (error) {
		res.status(500).send(JSON.stringify({ error: error.message }));
	}
});

router.post("/:userid", validate(coinSchema), async (req, res) => {
	const userid = req.params.userid;
	const coinData = req.body;

	try {
		const results = await verifyIfCoinExists(
			`users/${userid}/coins`,
			coinData
		);

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
	} catch (error) {
		res.status(500).send(JSON.stringify({ error: error.message }));
	}
});

router.get("/:userid/coin/:id", async (req, res) => {
	const userid = req.params.userid;
	const id = req.params.id;

	try {
		const data = await getData(
			`users/${userid}/coins`,
			undefined,
			undefined,
			id
		);
		res.send(JSON.stringify(data));
	} catch (error) {
		res.status(500).send(JSON.stringify({ error: error.message }));
	}
});

router.put("/:userid/coin/:id", validate(coinSchema), async (req, res) => {
	try {
		const userid = req.params.userid;
		const id = req.params.id;

		if (req.body.id) delete req.body.id;

		await updateData(`users/${userid}/coins`, id, req.body);
		const results = await verifyIfCoinExists(
			`users/${userid}/coins`,
			req.body
		);

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
	} catch (error) {
		res.status(500).send(JSON.stringify({ error: error.message }));
	}
});

router.delete("/:userid/coin/:id", async (req, res) => {
	const userid = req.params.userid;
	const id = req.params.id;

	try {
		const data = await deleteData(`users/${userid}/coins`, id);
		res.send(JSON.stringify(data));
	} catch (error) {
		res.status(500).send(JSON.stringify({ error: error.message }));
	}
});
