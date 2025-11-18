"use client";

import { BusinessGrid } from "@/components/business/BusinessGrid";
import { DEV_DEFAULTS } from "@/lib/constants/storage";
import { getBookmarkedBusinessIds } from "@/lib/services/bookmarks";
import { getBusinessById } from "@/lib/services/business";
import type { Business } from "@/lib/types/business";
import { useEffect, useState } from "react";

export default function BookmarksPage() {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Get demo user ID (in real app, this would come from session)
    const userId = DEV_DEFAULTS.DEMO_USER_ID;

    useEffect(() => {
        loadBookmarks();
    }, []);

    const loadBookmarks = () => {
        setIsLoading(true);
        try {
            const bookmarkedIds = getBookmarkedBusinessIds(userId);
            const bookmarkedBusinesses = bookmarkedIds
                .map((id) => getBusinessById(id))
                .filter((b): b is Business => b !== null);
            setBusinesses(bookmarkedBusinesses);
        } catch (error) {
            console.error("Failed to load bookmarks:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Saved Businesses
                </h1>
                <p className="text-muted-foreground mt-2">
                    Your bookmarked favorite local spots
                </p>
            </div>

            {isLoading ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading bookmarks...</p>
                </div>
            ) : (
                <BusinessGrid
                    businesses={businesses}
                    emptyMessage="You haven't bookmarked any businesses yet. Start exploring and save your favorites!"
                />
            )}
        </div>
    );
}

