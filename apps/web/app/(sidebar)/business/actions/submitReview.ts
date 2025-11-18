/**
 * Server action for submitting a review
 * Note: Actual logic runs client-side since we use localStorage
 */

import { reviewFormSchema } from "@/lib/schemas/review";
import type { ReviewSubmissionResult } from "@/lib/types/review";

export async function submitReviewAction(
	formData: FormData
): Promise<ReviewSubmissionResult> {
	"use server";
	try {
		// Validate input
		const data = {
			businessId: formData.get("businessId") as string,
			rating: parseInt(formData.get("rating") as string),
			text: formData.get("text") as string,
		};

		const validated = reviewFormSchema.safeParse(data);
		if (!validated.success) {
			return {
				success: false,
				error: validated.error.errors[0]?.message || "Validation failed",
			};
		}

		// Return success - actual submission handled client-side
		return {
			success: true,
		};
	} catch (error) {
		console.error("Review submission error:", error);
		return {
			success: false,
			error: "Failed to submit review. Please try again.",
		};
	}
}

