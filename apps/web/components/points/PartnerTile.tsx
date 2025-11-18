"use client";

import type { RedemptionPartner } from "@/lib/types/user";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { Award } from "lucide-react";

interface PartnerTileProps {
    partner: RedemptionPartner;
    userPoints: number;
    onRedeem: (partnerId: string) => void;
}

export function PartnerTile({
    partner,
    userPoints,
    onRedeem,
}: PartnerTileProps) {
    const canAfford = userPoints >= partner.pointsRequired;
    const isAvailable = partner.available && canAfford;

    return (
        <Card className={!partner.available ? "opacity-60" : ""}>
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg">{partner.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {partner.description}
                        </p>
                    </div>
                    {!partner.available && <Badge variant="outline">Unavailable</Badge>}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                    <Award className="size-5 text-primary" />
                    <span className="font-semibold text-lg">
                        {partner.pointsRequired.toLocaleString()} points
                    </span>
                </div>

                <Button
                    onClick={() => onRedeem(partner.id)}
                    disabled={!isAvailable}
                    className="w-full"
                >
                    {!canAfford
                        ? `Need ${(partner.pointsRequired - userPoints).toLocaleString()} more points`
                        : `Redeem for ${partner.rewardValue}`}
                </Button>

                {!canAfford && partner.available && (
                    <p className="text-xs text-muted-foreground text-center">
                        Earn points by reviewing businesses and making purchases
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

