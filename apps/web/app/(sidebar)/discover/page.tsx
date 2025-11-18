"use client";

import { BusinessGrid } from "@/components/business/BusinessGrid";
import { FilterBar } from "@/components/business/FilterBar";
import { seedDemoData, getDemoDataStatus } from "@/data/seedData";
import { getFilteredBusinesses } from "@/lib/services/business";
import type { Business, BusinessFilters } from "@/lib/types/business";
import { Alert, AlertDescription } from "@repo/ui/components/alert";
import { Button } from "@repo/ui/components/button";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function DiscoverPage() {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [filters, setFilters] = useState<BusinessFilters>({
        sortBy: "rating",
        sortOrder: "desc",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [needsSeeding, setNeedsSeeding] = useState(false);

    useEffect(() => {
        // Check if demo data exists
        const status = getDemoDataStatus();
        if (status.businesses === 0) {
            setNeedsSeeding(true);
            setIsLoading(false);
        } else {
            loadBusinesses(filters);
        }
    }, []);

    const loadBusinesses = (newFilters: BusinessFilters) => {
        setIsLoading(true);
        try {
            const filtered = getFilteredBusinesses(newFilters);
            setBusinesses(filtered);
            setFilters(newFilters);
        } catch (error) {
            console.error("Failed to load businesses:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSeedData = () => {
        const success = seedDemoData();
        if (success) {
            setNeedsSeeding(false);
            loadBusinesses(filters);
        }
    };

    if (needsSeeding) {
        return (
            <div className="container mx-auto py-8">
                <Alert>
                    <Sparkles className="size-4" />
                    <AlertDescription className="flex items-center justify-between">
                        <span>
                            Welcome to Yolo! Click below to load demo businesses and
                            get started.
                        </span>
                        <Button onClick={handleSeedData} className="ml-4">
                            Load Demo Data
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Discover Local Businesses
                </h1>
                <p className="text-muted-foreground mt-2">
                    Explore, review, and earn points at your favorite local spots
                </p>
            </div>

            <FilterBar
                onFilterChange={loadBusinesses}
                initialFilters={filters}
            />

            {isLoading ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading businesses...</p>
                </div>
            ) : (
                <BusinessGrid businesses={businesses} />
            )}
        </div>
    );
}

