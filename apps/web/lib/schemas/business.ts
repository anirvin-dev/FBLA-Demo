/**
 * Zod validation schemas for business data
 */
import { z } from "zod";

export const businessCategorySchema = z.enum(["food", "retail", "services"]);

export const dealSchema = z.object({
	id: z.string(),
	businessId: z.string(),
	title: z.string().min(3).max(100),
	description: z.string().max(500),
	expires: z.string().datetime(),
	pointsCost: z.number().int().nonnegative().optional(),
	terms: z.string().optional(),
});

export const businessSchema = z.object({
	id: z.string(),
	name: z.string().min(2).max(100),
	category: businessCategorySchema,
	address: z.string().min(5).max(200),
	rating: z.number().min(0).max(5),
	reviewsCount: z.number().int().nonnegative(),
	description: z.string().min(10).max(1000),
	verified: z.boolean(),
	images: z.array(z.string().url()),
	deals: z.array(dealSchema),
	phone: z.string().optional(),
	website: z.string().url().optional(),
	hours: z.string().optional(),
	affiliateTags: z.array(z.string()).optional(),
});

export const claimedDealSchema = z.object({
	dealId: z.string(),
	businessId: z.string(),
	userId: z.string(),
	claimedAt: z.string().datetime(),
	used: z.boolean(),
});

export type BusinessInput = z.infer<typeof businessSchema>;
export type DealInput = z.infer<typeof dealSchema>;
export type ClaimedDealInput = z.infer<typeof claimedDealSchema>;

