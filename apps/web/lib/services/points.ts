/**
 * Points service for managing user points
 * Client-side only - uses localStorage
 */

"use client";

import { STORAGE_KEYS, POINTS_CONFIG } from "@/lib/constants/storage";
import type {
	UserPoints,
	PointTransaction,
	PartnerRedemption,
	RedemptionPartner,
} from "@/lib/types/user";
import { updateUserPoints } from "@/lib/auth/demo-storage";

/**
 * Get user points data
 */
export function getUserPoints(userId: string): UserPoints {
	if (typeof window === "undefined") {
		return {
			userId,
			total: 0,
			earned: 0,
			spent: 0,
			transactions: [],
		};
	}

	try {
		const data = localStorage.getItem(STORAGE_KEYS.USER_POINTS);
		if (!data) {
			return {
				userId,
				total: 0,
				earned: 0,
				spent: 0,
				transactions: [],
			};
		}

		const allPoints: UserPoints[] = JSON.parse(data);
		return (
			allPoints.find((p) => p.userId === userId) || {
				userId,
				total: 0,
				earned: 0,
				spent: 0,
				transactions: [],
			}
		);
	} catch (error) {
		console.error("Failed to get user points:", error);
		return {
			userId,
			total: 0,
			earned: 0,
			spent: 0,
			transactions: [],
		};
	}
}

/**
 * Add points to user account
 */
export function addPoints(
	userId: string,
	amount: number,
	source: string,
	description: string
): boolean {
	try {
		const data = localStorage.getItem(STORAGE_KEYS.USER_POINTS);
		const allPoints: UserPoints[] = data ? JSON.parse(data) : [];

		let userPoints = allPoints.find((p) => p.userId === userId);

		if (!userPoints) {
			userPoints = {
				userId,
				total: 0,
				earned: 0,
				spent: 0,
				transactions: [],
			};
			allPoints.push(userPoints);
		}

		// Create transaction
		const transaction: PointTransaction = {
			id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			userId,
			type: "earned",
			amount,
			source,
			description,
			timestamp: new Date().toISOString(),
		};

		// Update points
		userPoints.total += amount;
		userPoints.earned += amount;
		userPoints.transactions.push(transaction);

		// Save to localStorage
		localStorage.setItem(STORAGE_KEYS.USER_POINTS, JSON.stringify(allPoints));

		// Update user points in user data
		updateUserPoints(userId, userPoints.total);

		return true;
	} catch (error) {
		console.error("Failed to add points:", error);
		return false;
	}
}

/**
 * Deduct points from user account
 */
export function deductPoints(
	userId: string,
	amount: number,
	source: string,
	description: string
): boolean {
	try {
		const userPoints = getUserPoints(userId);

		if (userPoints.total < amount) {
			console.warn("Insufficient points");
			return false;
		}

		const data = localStorage.getItem(STORAGE_KEYS.USER_POINTS);
		const allPoints: UserPoints[] = data ? JSON.parse(data) : [];
		const userIndex = allPoints.findIndex((p) => p.userId === userId);

		if (userIndex === -1) return false;

		// Create transaction
		const transaction: PointTransaction = {
			id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			userId,
			type: "spent",
			amount,
			source,
			description,
			timestamp: new Date().toISOString(),
		};

		// Update points
		allPoints[userIndex].total -= amount;
		allPoints[userIndex].spent += amount;
		allPoints[userIndex].transactions.push(transaction);

		// Save to localStorage
		localStorage.setItem(STORAGE_KEYS.USER_POINTS, JSON.stringify(allPoints));

		// Update user points in user data
		updateUserPoints(userId, allPoints[userIndex].total);

		return true;
	} catch (error) {
		console.error("Failed to deduct points:", error);
		return false;
	}
}

/**
 * Calculate points earned from a purchase
 */
export function calculatePurchasePoints(dollarAmount: number): number {
	return Math.floor(dollarAmount * POINTS_CONFIG.DOLLARS_TO_POINTS);
}

/**
 * Get all redemption partners
 */
export function getRedemptionPartners(): RedemptionPartner[] {
	if (typeof window === "undefined") return [];

	try {
		const data = sessionStorage.getItem("yolo_partners");
		if (!data) return [];
		return JSON.parse(data);
	} catch (error) {
		console.error("Failed to get partners:", error);
		return [];
	}
}

/**
 * Redeem points for a partner reward
 */
export function redeemPoints(
	userId: string,
	partnerId: string
): PartnerRedemption | null {
	try {
		const partners = getRedemptionPartners();
		const partner = partners.find((p) => p.id === partnerId);

		if (!partner || !partner.available) {
			console.warn("Partner not found or unavailable");
			return null;
		}

		// Check if user has enough points
		const userPoints = getUserPoints(userId);
		if (userPoints.total < partner.pointsRequired) {
			console.warn("Insufficient points for redemption");
			return null;
		}

		// Deduct points
		const success = deductPoints(
			userId,
			partner.pointsRequired,
			"redemption",
			`Redeemed ${partner.rewardValue} ${partner.name} reward`
		);

		if (!success) return null;

		// Create redemption record
		const redemption: PartnerRedemption = {
			id: `red_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			userId,
			partnerId,
			partnerName: partner.name,
			pointsSpent: partner.pointsRequired,
			rewardValue: partner.rewardValue,
			status: "completed",
			redeemedAt: new Date().toISOString(),
			code: `YOLO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
		};

		// Save redemption
		const data = localStorage.getItem(STORAGE_KEYS.REDEMPTIONS);
		const redemptions: PartnerRedemption[] = data ? JSON.parse(data) : [];
		redemptions.push(redemption);
		localStorage.setItem(
			STORAGE_KEYS.REDEMPTIONS,
			JSON.stringify(redemptions)
		);

		return redemption;
	} catch (error) {
		console.error("Failed to redeem points:", error);
		return null;
	}
}

/**
 * Get user's redemption history
 */
export function getUserRedemptions(userId: string): PartnerRedemption[] {
	if (typeof window === "undefined") return [];

	try {
		const data = localStorage.getItem(STORAGE_KEYS.REDEMPTIONS);
		if (!data) return [];

		const redemptions: PartnerRedemption[] = JSON.parse(data);
		return redemptions
			.filter((r) => r.userId === userId)
			.sort(
				(a, b) =>
					new Date(b.redeemedAt).getTime() -
					new Date(a.redeemedAt).getTime()
			);
	} catch (error) {
		console.error("Failed to get redemptions:", error);
		return [];
	}
}

