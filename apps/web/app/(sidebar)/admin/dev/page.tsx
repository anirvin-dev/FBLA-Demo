"use client";

import { seedDemoData, resetDemoData, getDemoDataStatus } from "@/data/seedData";
import { isDevModeEnabled, toggleDevMode } from "@/lib/auth/demo-storage";
import { getUserPoints, addPoints } from "@/lib/services/points";
import { Alert, AlertDescription } from "@repo/ui/components/alert";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Badge } from "@repo/ui/components/badge";
import { Switch } from "@repo/ui/components/switch";
import {
    Settings,
    Database,
    RefreshCcw,
    Award,
    AlertCircle,
    CheckCircle,
    User,
} from "lucide-react";
import { DEV_DEFAULTS, STORAGE_KEYS } from "@/lib/constants/storage";
import { useState, useEffect } from "react";

export default function DevAdminPage() {
    const [dataStatus, setDataStatus] = useState({
        businesses: 0,
        reviews: 0,
        deals: 0,
        users: 0,
        bookmarks: 0,
    });
    const [userPoints, setUserPoints] = useState(0);
    const [pointsToAdd, setPointsToAdd] = useState("");
    const [devMode, setDevMode] = useState(false);
    const [useNirv, setUseNirv] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const userId = DEV_DEFAULTS.DEMO_USER_ID;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const status = getDemoDataStatus();
        setDataStatus(status);

        const points = getUserPoints(userId);
        setUserPoints(points.total);

        setDevMode(isDevModeEnabled());

        // Load useNirv setting from localStorage
        const nirvSetting = localStorage.getItem(STORAGE_KEYS.USE_NIRV);
        setUseNirv(nirvSetting === "true");
    };

    const handleSeedData = () => {
        const success = seedDemoData();
        if (success) {
            showMessage("success", "Demo data loaded successfully!");
            loadData();
        } else {
            showMessage("error", "Failed to load demo data");
        }
    };

    const handleResetData = () => {
        const confirmed = confirm(
            "Are you sure you want to reset all demo data? This cannot be undone."
        );
        if (confirmed) {
            const success = resetDemoData();
            if (success) {
                showMessage("success", "Demo data reset successfully!");
                loadData();
            } else {
                showMessage("error", "Failed to reset demo data");
            }
        }
    };

    const handleAddPoints = () => {
        const amount = parseInt(pointsToAdd);
        if (isNaN(amount) || amount <= 0) {
            showMessage("error", "Please enter a valid positive number");
            return;
        }

        const success = addPoints(
            userId,
            amount,
            "admin",
            "Admin added points for testing"
        );

        if (success) {
            showMessage("success", `Added ${amount} points successfully!`);
            setPointsToAdd("");
            loadData();
        } else {
            showMessage("error", "Failed to add points");
        }
    };

    const handleToggleDevMode = (enabled: boolean) => {
        toggleDevMode(enabled);
        setDevMode(enabled);
        showMessage(
            "success",
            `Dev Mode ${enabled ? "enabled" : "disabled"}. ${enabled ? "Auth and bot verification will be skipped." : "Normal mode restored."}`
        );
    };

    const handleToggleNirv = (enabled: boolean) => {
        localStorage.setItem(STORAGE_KEYS.USE_NIRV, enabled ? "true" : "false");
        setUseNirv(enabled);
        showMessage(
            "success",
            enabled
                ? "Nirv recommendation engine enabled (stub - not implemented)"
                : "Nirv recommendation engine disabled"
        );
    };

    const showMessage = (type: "success" | "error", text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Developer Admin Panel
                </h1>
                <p className="text-muted-foreground mt-2">
                    Manage demo data and test settings
                </p>
            </div>

            {message && (
                <Alert variant={message.type === "error" ? "destructive" : "default"}>
                    {message.type === "success" ? (
                        <CheckCircle className="size-4" />
                    ) : (
                        <AlertCircle className="size-4" />
                    )}
                    <AlertDescription>{message.text}</AlertDescription>
                </Alert>
            )}

            {/* Data Status */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Database className="size-5" />
                        <h2 className="text-xl font-semibold">Data Status</h2>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Businesses</p>
                            <p className="text-2xl font-bold">{dataStatus.businesses}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Reviews</p>
                            <p className="text-2xl font-bold">{dataStatus.reviews}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Deals</p>
                            <p className="text-2xl font-bold">{dataStatus.deals}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Users</p>
                            <p className="text-2xl font-bold">{dataStatus.users}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Bookmarks</p>
                            <p className="text-2xl font-bold">{dataStatus.bookmarks}</p>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-6">
                        <Button onClick={handleSeedData} className="flex-1">
                            <Database className="size-4 mr-2" />
                            Load Demo Data
                        </Button>
                        <Button
                            onClick={handleResetData}
                            variant="destructive"
                            className="flex-1"
                        >
                            <RefreshCcw className="size-4 mr-2" />
                            Reset All Data
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Session Info */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <User className="size-5" />
                        <h2 className="text-xl font-semibold">Current Session</h2>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div>
                        <p className="text-sm text-muted-foreground">User ID</p>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                            {userId}
                        </code>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">User Name</p>
                        <p className="font-medium">{DEV_DEFAULTS.DEMO_USER_NAME}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{DEV_DEFAULTS.DEMO_USER_EMAIL}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Points Balance</p>
                        <p className="text-2xl font-bold flex items-center gap-2">
                            <Award className="size-5 text-primary" />
                            {userPoints.toLocaleString()}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Add Points */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Award className="size-5" />
                        <h2 className="text-xl font-semibold">Test Points</h2>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="points-amount">Add Points to Demo User</Label>
                        <div className="flex gap-2 mt-2">
                            <Input
                                id="points-amount"
                                type="number"
                                value={pointsToAdd}
                                onChange={(e) => setPointsToAdd(e.target.value)}
                                placeholder="Enter amount"
                                min="1"
                            />
                            <Button onClick={handleAddPoints}>Add Points</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Settings */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Settings className="size-5" />
                        <h2 className="text-xl font-semibold">Settings</h2>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">DEV_MODE</p>
                            <p className="text-sm text-muted-foreground">
                                Skip auth and bot verification for faster demo
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={devMode}
                                onCheckedChange={handleToggleDevMode}
                            />
                            <Badge variant={devMode ? "default" : "outline"}>
                                {devMode ? "ON" : "OFF"}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Use Nirv Recommendations</p>
                            <p className="text-sm text-muted-foreground">
                                Enable AI-powered business recommendations (demo stub)
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={useNirv}
                                onCheckedChange={handleToggleNirv}
                            />
                            <Badge variant={useNirv ? "default" : "outline"}>
                                {useNirv ? "ON" : "OFF"}
                            </Badge>
                        </div>
                    </div>

                    {useNirv && (
                        <Alert>
                            <AlertCircle className="size-4" />
                            <AlertDescription>
                                <strong>Nirv Integration Pending:</strong> This feature is
                                currently a stub for demo purposes. In production, this would
                                connect to an AI recommendation engine to personalize business
                                suggestions.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Demo Info */}
            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold">Demo Information</h3>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                        ⚠️ <strong>This is a demo application for FBLA.</strong> All data
                        is stored locally in your browser&apos;s localStorage.
                    </p>
                    <p className="text-muted-foreground">
                        • No real transactions or payments are processed
                        <br />
                        • Authentication is simulated (not secure for production)
                        <br />
                        • Nirv AI recommendations are stubbed
                        <br />• Partner redemptions are simulated
                    </p>
                    <p className="text-muted-foreground">
                        For a production deployment, you would need:
                        <br />
                        • Real authentication (OAuth, JWT, etc.)
                        <br />
                        • Backend API with a database
                        <br />
                        • Payment processing integration
                        <br />
                        • Actual partner API connections
                        <br />• Security measures and data encryption
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

