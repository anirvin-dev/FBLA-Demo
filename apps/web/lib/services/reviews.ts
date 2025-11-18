/**
 * Review service for managing review data
 * Client-side only - uses localStorage
 */

"use client";

import { STORAGE_KEYS, POINTS_CONFIG } from "@/lib/constants/storage";
import type { Review } from "@/lib/types/review";
import { updateBusinessStats } from "./business";
import { addPoints } from "./points";

/**
 * Get all reviews from localStorage
 */
export function getAllReviews(): Review[] {
	if (typeof window === "undefined") return [];

	try {
		const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
		if (!data) return [];
		return JSON.parse(data);
	} catch (error) {
		console.error("Failed to get reviews:", error);
		return [];
	}
}

/**
 * Get reviews for a specific business
 */
export function getReviewsByBusinessId(businessId: string): Review[] {
	const reviews = getAllReviews();
	return reviews
		.filter((r) => r.businessId === businessId)
		.sort(
			(a, b) =>
				new Date(b.timestamp).getTime() -
				new Date(a.timestamp).getTime()
		);
}

/**
 * Get reviews by a specific user
 */
export function getReviewsByUserId(userId: string): Review[] {
	const reviews = getAllReviews();
	return reviews
		.filter((r) => r.userId === userId)
		.sort(
			(a, b) =>
				new Date(b.timestamp).getTime() -
				new Date(a.timestamp).getTime()
		);
}

/**
 * Calculate points awarded for a review
 */
export function calculateReviewPoints(rating: number, text: string): number {
	let points = POINTS_CONFIG.BASE_REVIEW_POINTS;

	// Bonus for longer reviews
	if (text.length >= POINTS_CONFIG.LONG_REVIEW_THRESHOLD) {
		points += POINTS_CONFIG.LONG_REVIEW_BONUS;
	}

	// Bonus for high ratings
	if (rating === 5) {
		points += POINTS_CONFIG.HIGH_RATING_BONUS;
	}

	return points;
}

/**
 * Add a new review
 */
export function addReview(review: Review): boolean {
	try {
		const reviews = getAllReviews();

		// Check if user already reviewed this business
		const existingReview = reviews.find(
			(r) =>
				r.userId === review.userId && r.businessId === review.businessId
		);

		if (existingReview) {
			console.warn("User has already reviewed this business");
			return false;
		}

		// Add review
		reviews.push(review);
		localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));

		// Update business stats
		updateBusinessStats(review.businessId);

		// Award points to user
		if (review.pointsAwarded > 0) {
			addPoints(
				review.userId,
				review.pointsAwarded,
				"review",
				`Review for business ${review.businessId}`
			);
		}

		return true;
	} catch (error) {
		console.error("Failed to add review:", error);
		return false;
	}
}

/**
 * Check if user can review a business
 */
export function canUserReview(
	userId: string,
	businessId: string
): boolean {
	const reviews = getAllReviews();
	return !reviews.some(
		(r) => r.userId === userId && r.businessId === businessId
	);
}

/**
 * Get review by ID
 */
export function getReviewById(id: string): Review | null {
	const reviews = getAllReviews();
	return reviews.find((r) => r.id === id) ?? null;
}

