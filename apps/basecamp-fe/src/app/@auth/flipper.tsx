"use client";

import NumberFlow, { continuous, type Format } from "@number-flow/react";
import { useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

const format: Format = {
	notation: "standard",
	maximumSignificantDigits: 1,
};

function usePollingCode(
	initialCode: string,
	fetcher: () => Promise<string | null>,
	intervalMs: number
) {
	const [code, setCode] = useState<string | null>(initialCode);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined
	);
	const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(
		undefined
	);

	useEffect(() => {
		// align first refresh to the next interval boundary
		const msToNextBoundary = intervalMs - (Date.now() % intervalMs);
		timeoutRef.current = setTimeout(async () => {
			const next = await fetcher();
			setCode(next);
			intervalRef.current = setInterval(() => {
				fetcher().then(setCode);
			}, intervalMs);
		}, msToNextBoundary);

		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [fetcher, intervalMs]);
	return code;
}

export function CodeFlipper({ initialCode }: { initialCode: string }) {
	const fetchCode = useCallback(async () => {
		const res = await fetch("/api", { next: { revalidate: 15 } });
		if (!res.ok) return null;
		return res.text();
	}, []);

	const code = usePollingCode(initialCode, fetchCode, 30 * 1000);

	// Fire confetti when the code equals 3506. Ensure it only fires once per match.
	const hasFiredConfettiRef = useRef<boolean>(false);

	useEffect(() => {
		if (!code) return;
		const paddedCode = code.toString().padStart(4, "0");
		if (paddedCode === "3506" && !hasFiredConfettiRef.current) {
			hasFiredConfettiRef.current = true;
			const durationMs = 10000;
			const endTime = Date.now() + durationMs;
			(function frame() {
				// Create a light, continuous rain from the top for the duration
				confetti({
					particleCount: 4,
					spread: 160,
					startVelocity: 25,
					gravity: 0.5,
					colors: ["#333333", "#54B6E5"],
					origin: { x: Math.random(), y: 0 },
				});
				if (Date.now() < endTime) requestAnimationFrame(frame);
			})();
		} else if (paddedCode !== "3506") {
			hasFiredConfettiRef.current = false;
		}
	}, [code]);

	const [secondsLeft, setSecondsLeft] = useState<number>(() => {
		const ms = 30_000 - (Date.now() % 30_000);
		return Math.ceil(ms / 1000);
	});

	useEffect(() => {
		const id = setInterval(() => {
			const ms = 30_000 - (Date.now() % 30_000);
			setSecondsLeft(Math.ceil(ms / 1000));
		}, 1000);
		return () => clearInterval(id);
	}, []);

	if (!code) {
		return null;
	}

	const padded = code.toString().padStart(4, "0");

	return (
		<div className="flex flex-col items-center gap-2">
			<div
				className={`flex gap-2 text-6xl ${hasFiredConfettiRef.current && "text-yeti-500"}`}
			>
				{padded.split("").map((digit, index) => (
					<div
						key={index}
						className="flex flex-col items-center text-6xl"
					>
						<NumberFlow
							style={
								{
									"--number-flow-char-height": "60px",
								} as React.CSSProperties
							}
							willChange
							plugins={[continuous]}
							value={parseInt(digit, 10)}
							format={format}
							className="~text-4xl/6xl"
						/>
					</div>
				))}
			</div>
			<div
				className={`text-muted-foreground text-sm ${secondsLeft < 10 && "text-red-600"}`}
			>
				Refreshes in {secondsLeft}s
			</div>
		</div>
	);
}
