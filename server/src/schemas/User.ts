import { z } from "zod";

export const userSchema = z.object({
	body: z.object({
		uid: z.string({
			required_error: "User id is required",
		}),
		displayName: z.string({
			required_error: "Name is required",
		}),
		email: z
			.string({
				required_error: "Email is required",
			})
			.email({
				message: "Insert a valid email",
			}),
		photoURL: z
			.string({
				required_error: "Photo is required",
			})
			.url({
				message: "Insert a valid url",
			}),
		password: z.optional(z.string()),
	}),
});
