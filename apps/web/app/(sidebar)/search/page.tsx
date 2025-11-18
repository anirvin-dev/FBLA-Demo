"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Business } from "@/lib/types/business";
import { searchBusinesses } from "@/lib/services/business";
import { BusinessGrid } from "@/components/business/BusinessGrid";
import { Input } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";
import { Search } from "lucide-react";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || "";

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<Business[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            const businesses = searchBusinesses(query);
            setResults(businesses);
            setHasSearched(true);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Search Businesses</h1>
                <p className="text-muted-foreground mt-2">
                    Find businesses by name, address, or description
                </p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search for businesses..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-10"
                        autoFocus
                    />
                </div>
                <Button type="submit">Search</Button>
            </form>

            {hasSearched && (
                <div>
                    <p className="text-sm text-muted-foreground mb-4">
                        Found {results.length} result{results.length !== 1 && "s"}{" "}
                        for &quot;{query}&quot;
                    </p>
                    <BusinessGrid
                        businesses={results}
                        emptyMessage="No businesses found matching your search"
                    />
                </div>
            )}
        </div>
    );
}

