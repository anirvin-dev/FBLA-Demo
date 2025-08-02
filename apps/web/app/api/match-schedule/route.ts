import { auth } from "@/lib/auth";
import { isSessionAuthorized } from "@/lib/auth/utils";
import { UserRole } from "@/lib/database/schema";
import { uploadMatchSchedule } from "@/lib/services/match-schedule-upload";
import {
	MalformedCsvError,
	ValidationError,
} from "@/lib/services/match-schedule-upload/errors";
import { NextResponse } from "next/server";

export const POST = auth(async (request) => {
	if (!isSessionAuthorized(UserRole.ADMIN, request.auth)) {
		return new Response("Forbidden", { status: 403 });
	}

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
});
