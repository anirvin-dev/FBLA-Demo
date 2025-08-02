import { uploadMatchSchedule } from "@/lib/services/match-schedule-upload";
import {
	MalformedCsvError,
	ValidationError,
} from "@/lib/services/match-schedule-upload/errors";
import { NextResponse } from "next/server";

/**
 * Handles the upload of a match schedule CSV file to the database.
 *
 * @param request - The request object
 * @returns A response object
 */
export async function POST(request: Request) {
	const form = await request.formData();
	const eventCode = form.get("eventCode")?.toString() ?? "";
	const csvFile = form.get("csvFile") as File | null;

	if (!eventCode || !csvFile) {
		return new Response("Missing event code or CSV file", { status: 400 });
	}

	const buf = Buffer.from(await csvFile.arrayBuffer());

	try {
		const result = await uploadMatchSchedule({ eventCode, csvBuffer: buf });
		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		if (
			error instanceof ValidationError ||
			error instanceof MalformedCsvError
		) {
			return new Response(error.message, { status: 400 });
		}
		return new Response("Internal server error", { status: 500 });
	}
}
