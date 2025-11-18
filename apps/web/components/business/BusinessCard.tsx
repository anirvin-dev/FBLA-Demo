"use client";

import type { Business } from "@/lib/types/business";
import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { Star, MapPin, MessageSquare, Verified } from "lucide-react";
import Link from "next/link";

interface BusinessCardProps {
    business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
    return (
        <Link href={`/business/${business.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg truncate">
                                    {business.name}
                                </h3>
                                {business.verified && (
                                    <Verified className="size-4 text-primary flex-shrink-0" />
                                )}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <MapPin className="size-3" />
                                <span className="truncate">{business.address}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="capitalize">
                            {business.category}
                        </Badge>
                        {business.deals.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                                {business.deals.length}{" "}
                                {business.deals.length === 1 ? "Deal" : "Deals"}
                            </Badge>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {business.description}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1">
                            <Star className="size-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{business.rating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MessageSquare className="size-3" />
                            <span>{business.reviewsCount} reviews</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

