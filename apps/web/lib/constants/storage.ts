/**
 * LocalStorage keys used throughout the Yolo demo app
 * All data persistence is client-side only for demo purposes
 */
export const STORAGE_KEYS = {
	// Business data
	BUSINESSES: "yolo_demo_businesses",
	REVIEWS: "yolo_demo_reviews",
	DEALS: "yolo_demo_deals",

	// User interactions
	BOOKMARKS: "yolo_bookmarks_v1",
	USER_POINTS: "yolo_user_points_v1",
	REDEMPTIONS: "yolo_redemptions_v1",
	CLAIMED_DEALS: "yolo_claimed_deals_v1",

	// Auth (DEMO ONLY - not secure)
	USER_SESSION: "yolo_session_demo",
	USER_DATA: "user_yolo_demo",

	// Dev settings
	DEV_MODE: "yolo_dev_mode",
	USE_NIRV: "yolo_use_nirv",
} as const;

/**
 * Default demo mode settings
 */
export const DEV_DEFAULTS = {
	AUTO_LOGIN: true,
	SKIP_BOT_VERIFICATION: true,
	DEMO_USER_ID: "demo_user_001",
	DEMO_USER_NAME: "Demo User",
	DEMO_USER_EMAIL: "demo@yolo.app",
} as const;

/**
 * Points system configuration
 */
export const POINTS_CONFIG = {
	// Purchase rewards
	DOLLARS_TO_POINTS: 1, // 1 dollar = 1 point

	// Review rewards
	BASE_REVIEW_POINTS: 10,
	LONG_REVIEW_BONUS: 10, // +10 for reviews > 100 chars
	LONG_REVIEW_THRESHOLD: 100,
	HIGH_RATING_BONUS: 5, // +5 for 5-star reviews

	// Minimum points for actions
	MIN_REDEMPTION_POINTS: 100,
} as const;

/**
 * App configuration
 */
export const APP_CONFIG = {
	DEMO_MODE: true,
	REQUIRE_AUTH: false, // Can be toggled in dev admin
	BOT_VERIFICATION_ENABLED: true, // Can be toggled in dev admin
} as const;

