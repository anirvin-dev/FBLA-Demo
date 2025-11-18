/**
 * Business-related TypeScript types for Yolo demo
 */

export type BusinessCategory = "food" | "retail" | "services";

export interface Business {
	id: string;
	name: string;
	category: BusinessCategory;
	address: string;
	rating: number; // 0-5
	reviewsCount: number;
	description: string;
	verified: boolean;
	images: string[]; // image paths
	deals: Deal[];
	phone?: string;
	website?: string;
	hours?: string;
	affiliateTags?: string[];
}

export interface Deal {
	id: string;
	businessId: string;
	title: string;
	description: string;
	expires: string; // ISO date string
	pointsCost?: number; // Optional: points required to unlock
	terms?: string;
}

export interface ClaimedDeal {
	dealId: string;
	businessId: string;
	userId: string;
	claimedAt: string; // ISO date string
	used: boolean;
}

export interface BusinessFilters {
	category?: BusinessCategory;
	searchQuery?: string;
	sortBy?: "rating" | "reviewsCount" | "name";
	sortOrder?: "asc" | "desc";
}

