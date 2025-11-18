"use client";

import { useCallback, useEffect, useState } from "react";
import type { UserPoints, PartnerRedemption } from "@/lib/types/user";
import { getUserPoints, getRedemptionPartners, redeemPoints, getUserRedemptions } from "@/lib/services/points";
import { PartnerTile } from "@/components/points/PartnerTile";
import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { Award, TrendingUp, TrendingDown, CheckCircle } from "lucide-react";
import { DEV_DEFAULTS } from "@/lib/constants/storage";

export default function PointsPage() {
    const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
    const [partners, setPartners] = useState<typeof import("@/data/mockPartners.json")>([]);
    const [redemptions, setRedemptions] = useState<PartnerRedemption[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Get demo user ID (in real app, this would come from session)
    const userId = DEV_DEFAULTS.DEMO_USER_ID;

    useEffect(() => {
        loadPointsData();
    }, []);

    const loadPointsData = useCallback(() => {
        setIsLoading(true);
        try {
            const points = getUserPoints(userId);
            setUserPoints(points);

            const partnersData = getRedemptionPartners();
            setPartners(partnersData);

            const redemptionsData = getUserRedemptions(userId);
            setRedemptions(redemptionsData);
        } catch (error) {
            console.error("Failed to load points data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    const handleRedeem = (partnerId: string) => {
        const redemption = redeemPoints(userId, partnerId);
        if (redemption) {
            alert(
                `Redemption successful! Your code: ${redemption.code}\n\nThis is a demo - in production, this would be sent to your email.`
            );
            loadPointsData(); // Refresh data
        } else {
            alert("Redemption failed. Please try again.");
        }
    };

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Loading points data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Points & Rewards</h1>
                <p className="text-muted-foreground mt-2">
                    Earn points and redeem them for rewards
                </p>
            </div>

            {/* Points Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <Award className="size-5 text-primary" />
                            <span className="font-medium">Total Points</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {userPoints?.total.toLocaleString() || 0}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="size-5 text-green-500" />
                            <span className="font-medium">Points Earned</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-500">
                            +{userPoints?.earned.toLocaleString() || 0}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <TrendingDown className="size-5 text-orange-500" />
                            <span className="font-medium">Points Redeemed</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-orange-500">
                            -{userPoints?.spent.toLocaleString() || 0}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Partners */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Redeem Points</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {partners.map((partner) => (
                        <PartnerTile
                            key={partner.id}
                            partner={partner}
                            userPoints={userPoints?.total || 0}
                            onRedeem={handleRedeem}
                        />
                    ))}
                </div>
            </div>

            {/* Recent Redemptions */}
            {redemptions.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Recent Redemptions</h2>
                    <div className="space-y-3">
                        {redemptions.slice(0, 5).map((redemption) => (
                            <Card key={redemption.id}>
                                <CardContent className="py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="size-5 text-green-500" />
                                            <div>
                                                <p className="font-semibold">
                                                    {redemption.partnerName} - {redemption.rewardValue}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Code: {redemption.code}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline">
                                                {redemption.pointsSpent} points
                                            </Badge>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(redemption.redeemedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* How to Earn */}
            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold">How to Earn Points</h3>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                        <Award className="size-4 mt-0.5 text-primary flex-shrink-0" />
                        <div>
                            <p className="font-medium">Leave Reviews</p>
                            <p className="text-muted-foreground">
                                Earn 10 points per review, plus bonuses for detailed reviews (100+ characters) and 5-star ratings
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <Award className="size-4 mt-0.5 text-primary flex-shrink-0" />
                        <div>
                            <p className="font-medium">Make Purchases</p>
                            <p className="text-muted-foreground">
                                Earn 1 point for every dollar spent at participating businesses
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

