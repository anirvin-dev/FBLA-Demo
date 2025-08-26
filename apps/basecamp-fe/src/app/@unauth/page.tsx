import { cookies } from "next/headers";
import { signJWT, verifyJWT } from "@/auth/utils";

async function authenticate(formData: FormData) {
	"use server";
	const sitePassword = formData.get("sitePassword");

	if (!sitePassword) {
		throw new Error("Site password is required");
	}

	// doesn't need to be super secure, nothing here is sensitive, just a soft check
	const matches = sitePassword.toString() === process.env.SITE_PASSWORD;

	if (!matches) {
		throw new Error("Invalid site password");
	}

	const cookieStore = await cookies();
	cookieStore.set("authToken", await signJWT());
}

export default async function UnauthorizedPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get("authToken")?.value;

	if (token && (await verifyJWT(token))) {
		return null;
	}

	return (
		<form action={authenticate}>
			<input type="password" name="sitePassword" />
			<button type="submit">Submit</button>
		</form>
	);
}
