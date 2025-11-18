/**
 * Zod validation schemas for review data
 */
import { z } from "zod";

export const reviewSchema = z.object({
	id: z.string(),
	businessId: z.string(),
	userId: z.string(),
	userName: z.string().min(1).max(100),
	userAvatar: z.string().url().optional(),
	rating: z.number().int().min(1).max(5),
	text: z.string().min(10).max(1000),
	timestamp: z.string().datetime(),
	pointsAwarded: z.number().int().nonnegative(),
	verified: z.boolean(),
	helpful: z.number().int().nonnegative().optional(),
});

export const reviewFormSchema = z.object({
	businessId: z.string(),
	rating: z.number().int().min(1).max(5),
	text: z
		.string()
		.min(10, "Review must be at least 10 characters")
		.max(1000, "Review must be less than 1000 characters"),
});

export const botVerificationSchema = z.object({
	answer: z.string().or(z.number()),
	challenge: z.string(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
export type ReviewFormInput = z.infer<typeof reviewFormSchema>;
export type BotVerificationInput = z.infer<typeof botVerificationSchema>;

