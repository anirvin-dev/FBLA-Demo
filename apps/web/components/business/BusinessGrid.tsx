"use client";

import type { Business } from "@/lib/types/business";
import { BusinessCard } from "./BusinessCard";

interface BusinessGridProps {
    businesses: Business[];
    emptyMessage?: string;
}

export function BusinessGrid({
    businesses,
    emptyMessage = "No businesses found",
}: BusinessGridProps) {
    if (businesses.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {businesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
            ))}
        </div>
    );
}

