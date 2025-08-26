"use server";

import { verifyJWT } from "@/auth/utils";
import { cookies } from "next/headers";

export async function getNewCode() {
	const cookieStore = await cookies();

	if (!cookieStore.get("authToken")) {
		return null;
	}

	const token = cookieStore.get("authToken")?.value;
	if (!token || !(await verifyJWT(token))) {
		return null;
	}

	const res = await fetch(`${process.env.BASECAMP_URL}/2fa`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) {
		return null;
	}

	const { code } = await res.json();

	return code;
}
