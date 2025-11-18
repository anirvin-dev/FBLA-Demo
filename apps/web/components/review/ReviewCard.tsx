"use client";

import type { Review } from "@/lib/types/review";
import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import { Star, Award } from "lucide-react";
interface ReviewCardProps {
    review: Review;
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function formatDate(isoString: string): string {
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    } catch {
        return "Recently";
    }
}

export function ReviewCard({ review }: ReviewCardProps) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <Avatar>
                            <AvatarFallback>
                                {getInitials(review.userName)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{review.userName}</p>
                            <p className="text-xs text-muted-foreground">
                                {formatDate(review.timestamp)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={`size-4 ${i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-2">
                <p className="text-sm leading-relaxed">{review.text}</p>

                {review.pointsAwarded > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2">
                        <Award className="size-3" />
                        <span>Earned {review.pointsAwarded} points</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

