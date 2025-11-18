/**
 * DEMO-ONLY Authentication System
 * 
 * WARNING: This is NOT production-ready authentication!
 * - Passwords are stored in plaintext/simple hash
 * - No proper encryption or security measures
 * - Sessions stored in localStorage (insecure)
 * - Only for FBLA demo purposes
 * 
 * In production, use proper auth like NextAuth, Clerk, or Auth0
 */

import { STORAGE_KEYS, DEV_DEFAULTS } from "@/lib/constants/storage";
import type { DemoUser, DemoSession } from "@/lib/types/user";
import { cookies } from "next/headers";

/**
 * Simple password hashing for demo (NOT SECURE)
 * In production, use bcrypt or similar
 */
export function hashPassword(password: string): string {
	// INSECURE: Just base64 encoding for demo
	// Real app would use bcrypt.hash(password, 10)
	return Buffer.from(password).toString("base64");
}

/**
 * Verify password against hash (demo only)
 */
export function verifyPassword(password: string, hash: string): boolean {
	return hashPassword(password) === hash;
}

/**
 * Create a demo session
 */
export async function createDemoSession(user: DemoUser): Promise<DemoSession> {
	const session: DemoSession = {
		userId: user.id,
		userName: user.name,
		userEmail: user.email,
		createdAt: new Date().toISOString(),
		expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
	};

	// Store session token in httpOnly cookie (more secure than localStorage for session)
	const sessionCookie = await cookies();
	sessionCookie.set("yolo_demo_session", JSON.stringify(session), {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 7 * 24 * 60 * 60, // 7 days
	});

	return session;
}

/**
 * Get current demo session
 */
export async function getDemoSession(): Promise<DemoSession | null> {
	const sessionCookie = await cookies();
	const sessionData = sessionCookie.get("yolo_demo_session");

	if (!sessionData?.value) {
		return null;
	}

	try {
		const session: DemoSession = JSON.parse(sessionData.value);

		// Check if session is expired
		if (new Date(session.expiresAt) < new Date()) {
			await clearDemoSession();
			return null;
		}

		return session;
	} catch {
		return null;
	}
}

/**
 * Clear demo session (logout)
 */
export async function clearDemoSession(): Promise<void> {
	const sessionCookie = await cookies();
	sessionCookie.delete("yolo_demo_session");
}

/**
 * Check if DEV_MODE is enabled (client-side check needed)
 */
export function isDevMode(): boolean {
	// Server-side: check environment variable
	return process.env.DEMO_DEV_MODE === "true" || process.env.NODE_ENV === "development";
}

/**
 * Get or create demo user (for auto-login in dev mode)
 */
export function getOrCreateDemoUser(): DemoUser {
	const demoUser: DemoUser = {
		id: DEV_DEFAULTS.DEMO_USER_ID,
		name: DEV_DEFAULTS.DEMO_USER_NAME,
		email: DEV_DEFAULTS.DEMO_USER_EMAIL,
		passwordHash: hashPassword("demo123"), // INSECURE: hardcoded demo password
		createdAt: new Date().toISOString(),
		points: 250, // Start with some points
	};

	return demoUser;
}

// Mark server actions with "use server" directive individually
export async function createDemoSessionAction(user: DemoUser): Promise<DemoSession> {
	"use server";
	return await createDemoSession(user);
}

export async function getDemoSessionAction(): Promise<DemoSession | null> {
	"use server";
	return await getDemoSession();
}

export async function clearDemoSessionAction(): Promise<void> {
	"use server";
	await clearDemoSession();
}

