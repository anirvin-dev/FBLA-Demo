import { verifyJWT } from "@/auth/utils";
import { cookies } from "next/headers";

export async function GET() {
	const cookieStore = await cookies();
	const token = cookieStore.get("authToken")?.value;

	if (!token || !(await verifyJWT(token))) {
		return new Response("Unauthorized", { status: 401 });
	}

	const response = await fetch(new URL("/2fa", process.env.BASECAMP_URL), {
		method: "GET",
		headers: {
			Authorization: `Bearer ${process.env.BASECAMP_TOKEN}`,
		},
	});

	if (!response.ok) {
		return new Response("Failed to fetch code", { status: 500 });
	}

	const { code } = await response.json();

	return new Response(code);
}

export const dynamic = "force-dynamic";
