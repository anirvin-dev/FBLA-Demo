/**
 * API route to get current demo session
 */

import { getDemoSession } from "@/lib/auth/demo-auth";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const session = await getDemoSession();

		if (!session) {
			return NextResponse.json(null, { status: 401 });
		}

		return NextResponse.json(session);
	} catch (error) {
		console.error("Session fetch error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch session" },
			{ status: 500 }
		);
	}
}

