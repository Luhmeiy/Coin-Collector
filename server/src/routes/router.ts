import express from "express";

import { router as coinRoutes } from "./coinRoutes";
import { router as presetCoinRouter } from "./presetCoinRoutes";
import { router as userRoutes } from "./userRoutes";

export const router = express();

router.use("/coins", coinRoutes);
router.use("/presets", presetCoinRouter);
router.use("/users", userRoutes);
