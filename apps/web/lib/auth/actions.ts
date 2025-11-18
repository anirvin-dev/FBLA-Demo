/**
 * Server actions for demo authentication
 */

import { z } from "zod";
import {
	createDemoSession,
	clearDemoSession,
	hashPassword,
	verifyPassword,
	getOrCreateDemoUser,
} from "./demo-auth";
import { findUserByEmail, createDemoUser, getAllDemoUsers } from "./demo-storage";
import { loginFormSchema, signupFormSchema } from "@/lib/schemas/user";
import type { DemoUser } from "@/lib/types/user";
import { redirect } from "next/navigation";

type ActionResult<T> =
	| { success: true; data: T }
	| { success: false; error: string };

/**
 * Login action
 */
export async function loginAction(
	formData: FormData
): Promise<ActionResult<{ redirectTo: string }>> {
	"use server";
	try {
		const data = {
			email: formData.get("email") as string,
			password: formData.get("password") as string,
		};

		// Validate input
		const validated = loginFormSchema.safeParse(data);
		if (!validated.success) {
			return {
				success: false,
				error: validated.error.errors[0]?.message || "Validation failed",
			};
		}

		// For demo, this needs to be done client-side since we can't access localStorage on server
		// This is a placeholder - actual login will be handled client-side
		// Just redirect to a client-side login handler

		return {
			success: true,
			data: { redirectTo: "/discover" },
		};
	} catch (error) {
		console.error("Login error:", error);
		return {
			success: false,
			error: "Login failed. Please try again.",
		};
	}
}

/**
 * Signup action
 */
export async function signupAction(
	formData: FormData
): Promise<ActionResult<{ redirectTo: string }>> {
	"use server";
	try {
		const data = {
			name: formData.get("name") as string,
			email: formData.get("email") as string,
			password: formData.get("password") as string,
		};

		// Validate input
		const validated = signupFormSchema.safeParse(data);
		if (!validated.success) {
			return {
				success: false,
				error: validated.error.errors[0]?.message || "Validation failed",
			};
		}

		// For demo, redirect to client-side signup handler
		return {
			success: true,
			data: { redirectTo: "/discover" },
		};
	} catch (error) {
		console.error("Signup error:", error);
		return {
			success: false,
			error: "Signup failed. Please try again.",
		};
	}
}

/**
 * Logout action
 */
export async function logoutAction() {
	"use server";
	await clearDemoSession();
	redirect("/");
}

/**
 * Auto-login with demo user (dev mode only)
 */
export async function autoLoginDemo() {
	"use server";
	const demoUser = getOrCreateDemoUser();
	await createDemoSession(demoUser);
	redirect("/discover");
}
