/**
 * Review-related TypeScript types for Yolo demo
 */

export interface Review {
	id: string;
	businessId: string;
	userId: string;
	userName: string;
	userAvatar?: string;
	rating: number; // 1-5
	text: string;
	timestamp: string; // ISO date string
	pointsAwarded: number;
	verified: boolean; // Passed bot verification
	helpful?: number; // Count of helpful votes (future feature)
}

export interface ReviewFormData {
	businessId: string;
	rating: number;
	text: string;
}

export interface ReviewSubmissionResult {
	success: boolean;
	review?: Review;
	pointsAwarded?: number;
	error?: string;
}

