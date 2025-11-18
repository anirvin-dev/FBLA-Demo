/**
 * Client-side localStorage utilities for demo auth
 * These run in the browser only
 */

"use client";

import { STORAGE_KEYS } from "@/lib/constants/storage";
import type { DemoUser } from "@/lib/types/user";

/**
 * Get all demo users from localStorage
 */
export function getAllDemoUsers(): DemoUser[] {
	if (typeof window === "undefined") return [];

	try {
		const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
		if (!data) return [];
		return JSON.parse(data);
	} catch {
		return [];
	}
}

/**
 * Find user by email
 */
export function findUserByEmail(email: string): DemoUser | null {
	const users = getAllDemoUsers();
	return users.find((u) => u.email === email) ?? null;
}

/**
 * Find user by ID
 */
export function findUserById(id: string): DemoUser | null {
	const users = getAllDemoUsers();
	return users.find((u) => u.id === id) ?? null;
}

/**
 * Create a new demo user
 */
export function createDemoUser(user: DemoUser): boolean {
	try {
		const users = getAllDemoUsers();

		// Check if email already exists
		if (users.some((u) => u.email === user.email)) {
			return false;
		}

		users.push(user);
		localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(users));
		return true;
	} catch {
		return false;
	}
}

/**
 * Update user points
 */
export function updateUserPoints(userId: string, points: number): boolean {
	try {
		const users = getAllDemoUsers();
		const userIndex = users.findIndex((u) => u.id === userId);

		if (userIndex === -1) return false;

		// At this point userIndex is guaranteed to be a valid index
		const user = users[userIndex];
		if (!user) return false;

		user.points = points;
		localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(users));
		return true;
	} catch {
		return false;
	}
}

/**
 * Check if dev mode is enabled (client-side)
 */
export function isDevModeEnabled(): boolean {
	if (typeof window === "undefined") return false;

	try {
		const devMode = localStorage.getItem(STORAGE_KEYS.DEV_MODE);
		return devMode === "true";
	} catch {
		return false;
	}
}

/**
 * Toggle dev mode
 */
export function toggleDevMode(enabled: boolean): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(STORAGE_KEYS.DEV_MODE, enabled ? "true" : "false");
}

