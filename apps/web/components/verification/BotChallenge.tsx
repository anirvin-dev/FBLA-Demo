"use client";

import { useState, useEffect } from "react";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Alert, AlertDescription } from "@repo/ui/components/alert";
import { Shield } from "lucide-react";

interface BotChallengeProps {
    onVerify: (success: boolean) => void;
    autoFillInDevMode?: boolean;
}

function generateChallenge(): { question: string; answer: number } {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return {
        question: `${num1} + ${num2}`,
        answer: num1 + num2,
    };
}

export function BotChallenge({
    onVerify,
    autoFillInDevMode = false,
}: BotChallengeProps) {
    const [challenge, setChallenge] = useState(generateChallenge());
    const [userAnswer, setUserAnswer] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        // Auto-fill in dev mode for easier demo
        if (autoFillInDevMode && process.env.NODE_ENV === "development") {
            setUserAnswer(challenge.answer.toString());
            onVerify(true);
        }
    }, [autoFillInDevMode, challenge.answer, onVerify]);

    const handleVerify = () => {
        const answer = parseInt(userAnswer);
        if (isNaN(answer)) {
            setError("Please enter a valid number");
            return;
        }

        if (answer === challenge.answer) {
            setError("");
            onVerify(true);
        } else {
            setError("Incorrect answer. Please try again.");
            setChallenge(generateChallenge());
            setUserAnswer("");
            onVerify(false);
        }
    };

    return (
        <div className="space-y-4">
            <Alert>
                <Shield className="size-4" />
                <AlertDescription>
                    Please complete this simple verification to continue
                </AlertDescription>
            </Alert>

            <div className="space-y-2">
                <Label htmlFor="bot-challenge">
                    What is {challenge.question}?
                </Label>
                <Input
                    id="bot-challenge"
                    type="number"
                    value={userAnswer}
                    onChange={(e) => {
                        setUserAnswer(e.target.value);
                        setError("");
                    }}
                    onBlur={handleVerify}
                    placeholder="Enter answer"
                    className={error ? "border-destructive" : ""}
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
        </div>
    );
}

