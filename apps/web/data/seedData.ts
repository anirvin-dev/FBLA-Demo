/**
 * Seed demo data into localStorage
 * This runs client-side only
 */

"use client";

import { STORAGE_KEYS } from "@/lib/constants/storage";
import mockBusinesses from "./mockBusinesses.json";
import mockReviews from "./mockReviews.json";
import mockDeals from "./mockDeals.json";
import mockPartners from "./mockPartners.json";

// Attach deals to businesses
const businessesWithDeals = mockBusinesses.map((business) => ({
	...business,
	deals: mockDeals.filter((deal) => deal.businessId === business.id),
}));

export function seedDemoData(): boolean {
	if (typeof window === "undefined") {
		console.error("seedDemoData must be called client-side");
		return false;
	}

	try {
		// Seed businesses
		localStorage.setItem(
			STORAGE_KEYS.BUSINESSES,
			JSON.stringify(businessesWithDeals)
		);

		// Seed reviews
		localStorage.setItem(
			STORAGE_KEYS.REVIEWS,
			JSON.stringify(mockReviews)
		);

		// Seed deals
		localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(mockDeals));

		// Initialize empty user data
		const existingUsers = localStorage.getItem(STORAGE_KEYS.USER_DATA);
		if (!existingUsers) {
			localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify([]));
		}

		// Initialize empty bookmarks
		localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify([]));

		// Initialize empty claimed deals
		localStorage.setItem(STORAGE_KEYS.CLAIMED_DEALS, JSON.stringify([]));

		// Initialize empty redemptions
		localStorage.setItem(STORAGE_KEYS.REDEMPTIONS, JSON.stringify([]));

		// Store partners (not in localStorage, just for reference)
		sessionStorage.setItem("yolo_partners", JSON.stringify(mockPartners));

		console.log("✅ Demo data seeded successfully!");
		return true;
	} catch (error) {
		console.error("Failed to seed demo data:", error);
		return false;
	}
}

export function resetDemoData(): boolean {
	if (typeof window === "undefined") {
		console.error("resetDemoData must be called client-side");
		return false;
	}

	try {
		// Remove all Yolo data from localStorage
		Object.values(STORAGE_KEYS).forEach((key) => {
			localStorage.removeItem(key);
		});

		// Remove partners from sessionStorage
		sessionStorage.removeItem("yolo_partners");

		console.log("✅ Demo data reset successfully!");
		return true;
	} catch (error) {
		console.error("Failed to reset demo data:", error);
		return false;
	}
}

export function getDemoDataStatus(): {
	businesses: number;
	reviews: number;
	deals: number;
	users: number;
	bookmarks: number;
} {
	if (typeof window === "undefined") {
		return {
			businesses: 0,
			reviews: 0,
			deals: 0,
			users: 0,
			bookmarks: 0,
		};
	}

	try {
		const businesses = JSON.parse(
			localStorage.getItem(STORAGE_KEYS.BUSINESSES) || "[]"
		);
		const reviews = JSON.parse(
			localStorage.getItem(STORAGE_KEYS.REVIEWS) || "[]"
		);
		const deals = JSON.parse(
			localStorage.getItem(STORAGE_KEYS.DEALS) || "[]"
		);
		const users = JSON.parse(
			localStorage.getItem(STORAGE_KEYS.USER_DATA) || "[]"
		);
		const bookmarks = JSON.parse(
			localStorage.getItem(STORAGE_KEYS.BOOKMARKS) || "[]"
		);

		return {
			businesses: businesses.length,
			reviews: reviews.length,
			deals: deals.length,
			users: users.length,
			bookmarks: bookmarks.length,
		};
	} catch {
		return {
			businesses: 0,
			reviews: 0,
			deals: 0,
			users: 0,
			bookmarks: 0,
		};
	}
}

