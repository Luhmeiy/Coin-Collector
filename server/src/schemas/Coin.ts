import { z } from "zod";

export const coinSchema = z.object({
	body: z.object({
		name: z.string({
			required_error: "Name is required",
		}),
		symbol: z.string({
			required_error: "Symbol is required",
		}),
		value: z.number({
			required_error: "Value is required",
		}),
		year: z
			.number({
				required_error: "Year is required",
			})
			.min(4, { message: "Must be 4 characters long" }),
		quantity: z
			.number({
				required_error: "Quantity is required",
			})
			.min(1, { message: "Quantity must be greater than 1" }),
	}),
});
