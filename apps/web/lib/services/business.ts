/**
 * Business service for managing business data
 * Client-side only - uses localStorage
 */

"use client";

import { STORAGE_KEYS } from "@/lib/constants/storage";
import type { Business, BusinessFilters } from "@/lib/types/business";

/**
 * Get all businesses from localStorage
 */
export function getAllBusinesses(): Business[] {
	if (typeof window === "undefined") return [];

	try {
		const data = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
		if (!data) return [];
		return JSON.parse(data);
	} catch (error) {
		console.error("Failed to get businesses:", error);
		return [];
	}
}

/**
 * Get business by ID
 */
export function getBusinessById(id: string): Business | null {
	const businesses = getAllBusinesses();
	return businesses.find((b) => b.id === id) ?? null;
}

/**
 * Get businesses with filters and sorting
 */
export function getFilteredBusinesses(
	filters: BusinessFilters = {}
): Business[] {
	let businesses = getAllBusinesses();

	// Apply category filter
	if (filters.category) {
		businesses = businesses.filter((b) => b.category === filters.category);
	}

	// Apply search query filter
	if (filters.searchQuery) {
		const query = filters.searchQuery.toLowerCase();
		businesses = businesses.filter(
			(b) =>
				b.name.toLowerCase().includes(query) ||
				b.address.toLowerCase().includes(query) ||
				b.description.toLowerCase().includes(query)
		);
	}

	// Apply sorting
	if (filters.sortBy) {
		const sortOrder = filters.sortOrder || "desc";
		businesses.sort((a, b) => {
			let aVal: number | string;
			let bVal: number | string;

			switch (filters.sortBy) {
				case "rating":
					aVal = a.rating;
					bVal = b.rating;
					break;
				case "reviewsCount":
					aVal = a.reviewsCount;
					bVal = b.reviewsCount;
					break;
				case "name":
					aVal = a.name.toLowerCase();
					bVal = b.name.toLowerCase();
					break;
				default:
					return 0;
			}

			if (sortOrder === "asc") {
				return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
			} else {
				return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
			}
		});
	}

	return businesses;
}

/**
 * Get businesses by category
 */
export function getBusinessesByCategory(
	category: Business["category"]
): Business[] {
	return getFilteredBusinesses({ category });
}

/**
 * Search businesses by query
 */
export function searchBusinesses(query: string): Business[] {
	return getFilteredBusinesses({ searchQuery: query });
}

/**
 * Get top rated businesses
 */
export function getTopRatedBusinesses(limit: number = 5): Business[] {
	const businesses = getAllBusinesses();
	return businesses
		.sort((a, b) => b.rating - a.rating)
		.slice(0, limit);
}

/**
 * Update business rating and review count
 * Called after a new review is added
 */
export function updateBusinessStats(businessId: string): boolean {
	try {
		const businesses = getAllBusinesses();
		const businessIndex = businesses.findIndex((b) => b.id === businessId);

		if (businessIndex === -1) return false;

		// Get reviews for this business
		const reviews = JSON.parse(
			localStorage.getItem(STORAGE_KEYS.REVIEWS) || "[]"
		);
		const businessReviews = reviews.filter(
			(r: { businessId: string }) => r.businessId === businessId
		);

		// Calculate new average rating
		const totalRating = businessReviews.reduce(
			(sum: number, r: { rating: number }) => sum + r.rating,
			0
		);
		const avgRating = businessReviews.length
			? totalRating / businessReviews.length
			: 0;

		// Update business (businessIndex is guaranteed valid here, but guard anyway)
		const business = businesses[businessIndex];
		if (!business) return false;

		business.rating = Math.round(avgRating * 10) / 10; // Round to 1 decimal
		business.reviewsCount = businessReviews.length;

		localStorage.setItem(
			STORAGE_KEYS.BUSINESSES,
			JSON.stringify(businesses)
		);

		return true;
	} catch (error) {
		console.error("Failed to update business stats:", error);
		return false;
	}
}

