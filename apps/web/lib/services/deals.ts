/**
 * Deals service for managing deal claims
 * Client-side only - uses localStorage
 */

"use client";

import { STORAGE_KEYS } from "@/lib/constants/storage";
import type { Deal, ClaimedDeal } from "@/lib/types/business";

/**
 * Get all deals from localStorage
 */
export function getAllDeals(): Deal[] {
	if (typeof window === "undefined") return [];

	try {
		const data = localStorage.getItem(STORAGE_KEYS.DEALS);
		if (!data) return [];
		return JSON.parse(data);
	} catch (error) {
		console.error("Failed to get deals:", error);
		return [];
	}
}

/**
 * Get deals for a specific business
 */
export function getDealsByBusinessId(businessId: string): Deal[] {
	const deals = getAllDeals();
	return deals.filter((d) => d.businessId === businessId);
}

/**
 * Get all claimed deals
 */
export function getAllClaimedDeals(): ClaimedDeal[] {
	if (typeof window === "undefined") return [];

	try {
		const data = localStorage.getItem(STORAGE_KEYS.CLAIMED_DEALS);
		if (!data) return [];
		return JSON.parse(data);
	} catch (error) {
		console.error("Failed to get claimed deals:", error);
		return [];
	}
}

/**
 * Get claimed deals for a user
 */
export function getUserClaimedDeals(userId: string): ClaimedDeal[] {
	const claimedDeals = getAllClaimedDeals();
	return claimedDeals.filter((cd) => cd.userId === userId);
}

/**
 * Check if a deal has been claimed by user
 */
export function isDealClaimed(userId: string, dealId: string): boolean {
	const claimedDeals = getAllClaimedDeals();
	return claimedDeals.some(
		(cd) => cd.userId === userId && cd.dealId === dealId
	);
}

/**
 * Claim a deal
 */
export function claimDeal(
	userId: string,
	dealId: string,
	businessId: string
): boolean {
	try {
		if (isDealClaimed(userId, dealId)) {
			console.warn("Deal already claimed by user");
			return false;
		}

		const claimedDeals = getAllClaimedDeals();
		const newClaim: ClaimedDeal = {
			dealId,
			businessId,
			userId,
			claimedAt: new Date().toISOString(),
			used: false,
		};

		claimedDeals.push(newClaim);
		localStorage.setItem(
			STORAGE_KEYS.CLAIMED_DEALS,
			JSON.stringify(claimedDeals)
		);

		return true;
	} catch (error) {
		console.error("Failed to claim deal:", error);
		return false;
	}
}

/**
 * Mark a claimed deal as used
 */
export function markDealAsUsed(userId: string, dealId: string): boolean {
	try {
		const claimedDeals = getAllClaimedDeals();
		const claimIndex = claimedDeals.findIndex(
			(cd) => cd.userId === userId && cd.dealId === dealId
		);

		if (claimIndex === -1) return false;

		claimedDeals[claimIndex].used = true;
		localStorage.setItem(
			STORAGE_KEYS.CLAIMED_DEALS,
			JSON.stringify(claimedDeals)
		);

		return true;
	} catch (error) {
		console.error("Failed to mark deal as used:", error);
		return false;
	}
}

/**
 * Get deal by ID
 */
export function getDealById(dealId: string): Deal | null {
	const deals = getAllDeals();
	return deals.find((d) => d.id === dealId) ?? null;
}

