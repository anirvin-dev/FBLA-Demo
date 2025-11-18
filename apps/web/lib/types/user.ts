/**
 * User and authentication types for Yolo demo
 * WARNING: This is demo-only auth - NOT production ready
 */

export interface DemoUser {
	id: string;
	name: string;
	email: string;
	passwordHash?: string; // INSECURE: demo only, would use proper hashing in production
	avatar?: string;
	createdAt: string; // ISO date string
	points: number;
}

export interface DemoSession {
	userId: string;
	userName: string;
	userEmail: string;
	createdAt: string;
	expiresAt: string;
}

export interface UserPoints {
	userId: string;
	total: number;
	earned: number;
	spent: number;
	transactions: PointTransaction[];
}

export interface PointTransaction {
	id: string;
	userId: string;
	type: "earned" | "spent";
	amount: number;
	source: string; // e.g., "review", "purchase", "redemption"
	description: string;
	timestamp: string; // ISO date string
	metadata?: Record<string, unknown>;
}

export interface PartnerRedemption {
	id: string;
	userId: string;
	partnerId: string;
	partnerName: string;
	pointsSpent: number;
	rewardValue: string; // e.g., "$10 Gift Card"
	status: "pending" | "completed" | "expired";
	redeemedAt: string; // ISO date string
	code?: string; // Redemption code (simulated)
}

export interface RedemptionPartner {
	id: string;
	name: string;
	logo: string;
	description: string;
	pointsRequired: number;
	rewardValue: string;
	available: boolean;
}

