import { z } from "zod";

export const presetSchema = z.object({
	body: z.object({
		final_emission_date: z
			.number({
				required_error: "Final emission date is required",
			})
			.min(4, { message: "Must be 4 characters long" }),
		initial_emission_date: z
			.number({
				required_error: "Initial emission date is required",
			})
			.min(4, { message: "Must be 4 characters long" }),
		name: z.string({
			required_error: "Name is required",
		}),
		symbol: z.string({
			required_error: "Symbol is required",
		}),
		value_range: z.array(
			z.number({
				required_error: "At least one value is required",
			})
		),
	}),
});
