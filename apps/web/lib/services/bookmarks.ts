/**
 * Bookmarks service for managing saved businesses
 * Client-side only - uses localStorage
 */

"use client";

import { STORAGE_KEYS } from "@/lib/constants/storage";

export interface Bookmark {
	userId: string;
	businessId: string;
	createdAt: string;
}

/**
 * Get all bookmarks from localStorage
 */
export function getAllBookmarks(): Bookmark[] {
	if (typeof window === "undefined") return [];

	try {
		const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
		if (!data) return [];
		return JSON.parse(data);
	} catch (error) {
		console.error("Failed to get bookmarks:", error);
		return [];
	}
}

/**
 * Get bookmarks for a specific user
 */
export function getUserBookmarks(userId: string): Bookmark[] {
	const bookmarks = getAllBookmarks();
	return bookmarks.filter((b) => b.userId === userId);
}

/**
 * Check if a business is bookmarked by user
 */
export function isBookmarked(userId: string, businessId: string): boolean {
	const bookmarks = getAllBookmarks();
	return bookmarks.some(
		(b) => b.userId === userId && b.businessId === businessId
	);
}

/**
 * Add a bookmark
 */
export function addBookmark(userId: string, businessId: string): boolean {
	try {
		if (isBookmarked(userId, businessId)) {
			return false; // Already bookmarked
		}

		const bookmarks = getAllBookmarks();
		const newBookmark: Bookmark = {
			userId,
			businessId,
			createdAt: new Date().toISOString(),
		};

		bookmarks.push(newBookmark);
		localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));

		return true;
	} catch (error) {
		console.error("Failed to add bookmark:", error);
		return false;
	}
}

/**
 * Remove a bookmark
 */
export function removeBookmark(userId: string, businessId: string): boolean {
	try {
		const bookmarks = getAllBookmarks();
		const filtered = bookmarks.filter(
			(b) => !(b.userId === userId && b.businessId === businessId)
		);

		localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(filtered));
		return true;
	} catch (error) {
		console.error("Failed to remove bookmark:", error);
		return false;
	}
}

/**
 * Toggle bookmark (add if not bookmarked, remove if bookmarked)
 */
export function toggleBookmark(userId: string, businessId: string): boolean {
	if (isBookmarked(userId, businessId)) {
		return removeBookmark(userId, businessId);
	} else {
		return addBookmark(userId, businessId);
	}
}

/**
 * Get bookmarked business IDs for a user
 */
export function getBookmarkedBusinessIds(userId: string): string[] {
	const bookmarks = getUserBookmarks(userId);
	return bookmarks.map((b) => b.businessId);
}

