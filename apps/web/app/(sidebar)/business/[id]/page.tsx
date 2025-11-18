"use client";

import { useEffect, useState } from "react";
import { ReviewCard } from "@/components/review/ReviewCard";
import { BotChallenge } from "@/components/verification/BotChallenge";
import { DEV_DEFAULTS } from "@/lib/constants/storage";
import { isBookmarked, toggleBookmark } from "@/lib/services/bookmarks";
import { getBusinessById } from "@/lib/services/business";
import { isDealClaimed, claimDeal } from "@/lib/services/deals";
import { addPoints, calculatePurchasePoints } from "@/lib/services/points";
import { getReviewsByBusinessId, canUserReview, addReview, calculateReviewPoints } from "@/lib/services/reviews";
import type { Business } from "@/lib/types/business";
import type { Review } from "@/lib/types/review";
import { Alert, AlertDescription } from "@repo/ui/components/alert";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";
import { Star, MapPin, Phone, Globe, Clock, Bookmark, BookmarkCheck, Tag, Award, DollarSign, Verified } from "lucide-react";
import { useParams } from "next/navigation";

export default function BusinessPage() {
    const params = useParams();
    const businessId = params.id as string;

    const [business, setBusiness] = useState<Business | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isBookmarkedState, setIsBookmarkedState] = useState(false);
    const [claimedDeals, setClaimedDeals] = useState<Set<string>>(new Set());

    // Review form state
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [reviewError, setReviewError] = useState("");
    const [verifiedForReview, setVerifiedForReview] = useState(false);

    // Purchase dialog state
    const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
    const [purchaseAmount, setPurchaseAmount] = useState("");
    const [verifiedForPurchase, setVerifiedForPurchase] = useState(false);

    // Deal claim state
    const [claimingDeal, setClaimingDeal] = useState<string | null>(null);
    const [verifiedForDeal, setVerifiedForDeal] = useState(false);

    // Get demo user ID (in real app, this would come from session)
    const userId = DEV_DEFAULTS.DEMO_USER_ID;
    const userName = DEV_DEFAULTS.DEMO_USER_NAME;

    useEffect(() => {
        loadBusinessData();
    }, [businessId]);

    const loadBusinessData = () => {
        const bizData = getBusinessById(businessId);
        if (bizData) {
            setBusiness(bizData);
            const reviewsData = getReviewsByBusinessId(businessId);
            setReviews(reviewsData);
            setIsBookmarkedState(isBookmarked(userId, businessId));

            // Load claimed deals
            const claimed = new Set<string>();
            bizData.deals.forEach((deal) => {
                if (isDealClaimed(userId, deal.id)) {
                    claimed.add(deal.id);
                }
            });
            setClaimedDeals(claimed);
        }
    };

    const handleBookmarkToggle = () => {
        toggleBookmark(userId, businessId);
        setIsBookmarkedState(!isBookmarkedState);
    };

    const handleSubmitReview = () => {
        if (!verifiedForReview) {
            setReviewError("Please complete the verification");
            return;
        }

        if (reviewText.trim().length < 10) {
            setReviewError("Review must be at least 10 characters");
            return;
        }

        const pointsAwarded = calculateReviewPoints(rating, reviewText);

        const newReview: Review = {
            id: `rev_${Date.now()}`,
            businessId,
            userId,
            userName,
            rating,
            text: reviewText.trim(),
            timestamp: new Date().toISOString(),
            pointsAwarded,
            verified: true,
        };

        const success = addReview(newReview);
        if (success) {
            setReviews([newReview, ...reviews]);
            setShowReviewForm(false);
            setReviewText("");
            setRating(5);
            setVerifiedForReview(false);
            alert(`Review submitted! You earned ${pointsAwarded} points!`);
        } else {
            setReviewError("Failed to submit review. You may have already reviewed this business.");
        }
    };

    const handleSimulatePurchase = () => {
        if (!verifiedForPurchase) {
            alert("Please complete the verification");
            return;
        }

        const amount = parseFloat(purchaseAmount);
        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        const pointsEarned = calculatePurchasePoints(amount);
        const success = addPoints(
            userId,
            pointsEarned,
            "purchase",
            `Simulated purchase at ${business?.name}`
        );

        if (success) {
            setShowPurchaseDialog(false);
            setPurchaseAmount("");
            setVerifiedForPurchase(false);
            alert(`Purchase successful! You earned ${pointsEarned} points!`);
        }
    };

    const handleClaimDeal = (dealId: string) => {
        if (!verifiedForDeal) {
            alert("Please complete the verification");
            return;
        }

        const success = claimDeal(userId, dealId, businessId);
        if (success) {
            setClaimedDeals(new Set(claimedDeals).add(dealId));
            setClaimingDeal(null);
            setVerifiedForDeal(false);
            alert("Deal claimed successfully!");
        } else {
            alert("Failed to claim deal. You may have already claimed it.");
        }
    };

    if (!business) {
        return <div className="py-12 text-center">Business not found</div>;
    }

    const canReview = canUserReview(userId, businessId);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-3xl font-bold">{business.name}</h1>
                        {business.verified && (
                            <Verified className="size-6 text-primary" />
                        )}
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                            <MapPin className="size-4" />
                            <span>{business.address}</span>
                        </div>
                        {business.phone && (
                            <div className="flex items-center gap-1">
                                <Phone className="size-4" />
                                <span>{business.phone}</span>
                            </div>
                        )}
                        {business.hours && (
                            <div className="flex items-center gap-1">
                                <Clock className="size-4" />
                                <span>{business.hours}</span>
                            </div>
                        )}
                    </div>
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleBookmarkToggle}
                >
                    {isBookmarkedState ? (
                        <BookmarkCheck className="size-4" />
                    ) : (
                        <Bookmark className="size-4" />
                    )}
                </Button>
            </div>

            {/* Rating and Category */}
            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                    <Star className="size-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-semibold">
                        {business.rating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">
                        ({business.reviewsCount} reviews)
                    </span>
                </div>
                <Badge variant="secondary" className="capitalize">
                    {business.category}
                </Badge>
            </div>

            {/* Description */}
            <Card>
                <CardHeader>
                    <h2 className="text-xl font-semibold">About</h2>
                </CardHeader>
                <CardContent>
                    <p className="leading-relaxed">{business.description}</p>
                    {business.website && (
                        <a
                            href={business.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-4 text-primary hover:underline"
                        >
                            <Globe className="size-4" />
                            Visit Website
                        </a>
                    )}
                </CardContent>
            </Card>

            {/* Deals */}
            {business.deals.length > 0 && (
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Tag className="size-5" />
                            Available Deals
                        </h2>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {business.deals.map((deal) => {
                            const isClaimed = claimedDeals.has(deal.id);
                            return (
                                <div
                                    key={deal.id}
                                    className="flex items-start justify-between gap-4 p-4 border rounded-lg"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{deal.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {deal.description}
                                        </p>
                                        {deal.terms && (
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {deal.terms}
                                            </p>
                                        )}
                                    </div>
                                    {isClaimed ? (
                                        <Badge>Claimed</Badge>
                                    ) : (
                                        <Dialog
                                            open={claimingDeal === deal.id}
                                            onOpenChange={(open) =>
                                                setClaimingDeal(open ? deal.id : null)
                                            }
                                        >
                                            <DialogTrigger asChild>
                                                <Button>Claim</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Claim Deal</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <p className="text-sm text-muted-foreground">
                                                        Verify you&apos;re human to claim this deal
                                                    </p>
                                                    <BotChallenge
                                                        onVerify={setVerifiedForDeal}
                                                    />
                                                    <Button
                                                        onClick={() => handleClaimDeal(deal.id)}
                                                        disabled={!verifiedForDeal}
                                                        className="w-full"
                                                    >
                                                        Confirm Claim
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                <Dialog
                    open={showPurchaseDialog}
                    onOpenChange={setShowPurchaseDialog}
                >
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <DollarSign className="size-4" />
                            Simulate Purchase
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Simulate Purchase</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="amount">Purchase Amount ($)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={purchaseAmount}
                                    onChange={(e) => setPurchaseAmount(e.target.value)}
                                    placeholder="Enter amount"
                                />
                                {purchaseAmount && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                        You will earn{" "}
                                        {calculatePurchasePoints(
                                            parseFloat(purchaseAmount) || 0
                                        )}{" "}
                                        points
                                    </p>
                                )}
                            </div>
                            <BotChallenge onVerify={setVerifiedForPurchase} />
                            <Button
                                onClick={handleSimulatePurchase}
                                disabled={!verifiedForPurchase}
                                className="w-full"
                            >
                                Complete Purchase
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {canReview && (
                    <Button
                        variant="outline"
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="flex items-center gap-2"
                    >
                        <Award className="size-4" />
                        Leave a Review
                    </Button>
                )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold">Write a Review</h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Rating</Label>
                            <div className="flex gap-1 mt-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`size-6 cursor-pointer ${i < rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                            }`}
                                        onClick={() => setRating(i + 1)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="review-text">Your Review</Label>
                            <Textarea
                                id="review-text"
                                value={reviewText}
                                onChange={(e) => {
                                    setReviewText(e.target.value);
                                    setReviewError("");
                                }}
                                placeholder="Share your experience..."
                                rows={4}
                                className="mt-2"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Earn bonus points for detailed reviews (100+ characters)
                            </p>
                        </div>

                        <BotChallenge onVerify={setVerifiedForReview} />

                        {reviewError && (
                            <Alert variant="destructive">
                                <AlertDescription>{reviewError}</AlertDescription>
                            </Alert>
                        )}

                        <div className="flex gap-2">
                            <Button onClick={handleSubmitReview} disabled={!verifiedForReview}>
                                Submit Review
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowReviewForm(false);
                                    setReviewText("");
                                    setRating(5);
                                    setReviewError("");
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Reviews */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                {reviews.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            No reviews yet. Be the first to review!
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

