import { cookies } from "next/headers";
import { verifyJWT } from "@/auth/utils";
import { CodeFlipper } from "./flipper";

export async function FlipperWrapper() {
	const cookieStore = await cookies();
	const token = cookieStore.get("authToken")?.value;

	if (!token || !(await verifyJWT(token))) {
		return null;
	}
	const response = await fetch(new URL("/2fa", process.env.BASECAMP_URL), {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		return null;
	}

	const { code } = await response.json();

	return <CodeFlipper initialCode={code} />;
}
