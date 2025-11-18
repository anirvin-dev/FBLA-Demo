/**
 * Zod validation schemas for user and auth data
 */
import { z } from "zod";

export const demoUserSchema = z.object({
	id: z.string(),
	name: z.string().min(2).max(100),
	email: z.string().email(),
	passwordHash: z.string().optional(),
	avatar: z.string().url().optional(),
	createdAt: z.string().datetime(),
	points: z.number().int().nonnegative(),
});

export const demoSessionSchema = z.object({
	userId: z.string(),
	userName: z.string(),
	userEmail: z.string().email(),
	createdAt: z.string().datetime(),
	expiresAt: z.string().datetime(),
});

export const loginFormSchema = z.object({
	email: z.string().email("Please enter a valid email"),
	password: z.string().min(1, "Password is required"),
});

export const signupFormSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Please enter a valid email"),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters (demo only)"),
});

export const pointTransactionSchema = z.object({
	id: z.string(),
	userId: z.string(),
	type: z.enum(["earned", "spent"]),
	amount: z.number().int().positive(),
	source: z.string(),
	description: z.string(),
	timestamp: z.string().datetime(),
	metadata: z.record(z.unknown()).optional(),
});

export const redemptionSchema = z.object({
	partnerId: z.string(),
	pointsToSpend: z.number().int().positive(),
});

export type DemoUserInput = z.infer<typeof demoUserSchema>;
export type DemoSessionInput = z.infer<typeof demoSessionSchema>;
export type LoginFormInput = z.infer<typeof loginFormSchema>;
export type SignupFormInput = z.infer<typeof signupFormSchema>;
export type PointTransactionInput = z.infer<typeof pointTransactionSchema>;
export type RedemptionInput = z.infer<typeof redemptionSchema>;

