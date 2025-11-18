"use client";

import { useState } from "react";
import type { BusinessCategory, BusinessFilters } from "@/lib/types/business";
import { Input } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/components/select";
import { Search, SlidersHorizontal } from "lucide-react";

interface FilterBarProps {
    onFilterChange: (filters: BusinessFilters) => void;
    initialFilters?: BusinessFilters;
}

const categories: { value: BusinessCategory; label: string }[] = [
    { value: "food", label: "Food & Dining" },
    { value: "retail", label: "Retail & Shopping" },
    { value: "services", label: "Services" },
];

const sortOptions = [
    { value: "rating", label: "Highest Rated" },
    { value: "reviewsCount", label: "Most Reviewed" },
    { value: "name", label: "Name (A-Z)" },
];

export function FilterBar({ onFilterChange, initialFilters }: FilterBarProps) {
    const [searchQuery, setSearchQuery] = useState(
        initialFilters?.searchQuery || ""
    );
    const [selectedCategory, setSelectedCategory] = useState<
        BusinessCategory | undefined
    >(initialFilters?.category);
    const [sortBy, setSortBy] = useState<BusinessFilters["sortBy"]>(
        initialFilters?.sortBy || "rating"
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const handleCategoryClick = (category: BusinessCategory) => {
        const newCategory =
            selectedCategory === category ? undefined : category;
        setSelectedCategory(newCategory);
        onFilterChange({
            searchQuery,
            category: newCategory,
            sortBy,
            sortOrder: "desc",
        });
    };

    const handleSortChange = (value: string) => {
        const newSortBy = value as BusinessFilters["sortBy"];
        setSortBy(newSortBy);
        onFilterChange({
            searchQuery,
            category: selectedCategory,
            sortBy: newSortBy,
            sortOrder: newSortBy === "name" ? "asc" : "desc",
        });
    };

    const applyFilters = () => {
        onFilterChange({
            searchQuery,
            category: selectedCategory,
            sortBy,
            sortOrder: sortBy === "name" ? "asc" : "desc",
        });
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory(undefined);
        setSortBy("rating");
        onFilterChange({ sortBy: "rating", sortOrder: "desc" });
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search businesses by name or address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button type="submit">Search</Button>
            </form>

            {/* Category Filters */}
            <div className="flex flex-wrap items-center gap-2">
                <SlidersHorizontal className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Categories:</span>
                {categories.map(({ value, label }) => (
                    <Badge
                        key={value}
                        variant={selectedCategory === value ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleCategoryClick(value)}
                    >
                        {label}
                    </Badge>
                ))}
            </div>

            {/* Sort and Clear */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Sort by:</span>
                    <Select value={sortBy} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {(searchQuery || selectedCategory) && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Clear Filters
                    </Button>
                )}
            </div>
        </div>
    );
}

