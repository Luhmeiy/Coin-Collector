import express from "express";
import {
	getData,
	registerUser,
	updateData,
} from "../controllers/DatabaseController";
import { validate } from "../middlewares/validate";
import { userSchema } from "../schemas/User";

export const router = express.Router();

router.post("/", validate(userSchema), async (req, res) => {
	const { uid } = req.body;

	const data = await registerUser(`users`, req.body, uid);

	res.send(JSON.stringify(data));
});

router.get("/:userid", async (req, res) => {
	const userid = req.params.userid;

	const data = await getData("users", undefined, undefined, userid);

	res.send(JSON.stringify(data));
});

router.put("/:userid", async (req, res) => {
	const userid = req.params.userid;

	const data = await updateData("users", userid, req.body);

	res.send(JSON.stringify(data));
});
