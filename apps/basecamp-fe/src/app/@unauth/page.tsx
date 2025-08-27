import { cookies } from "next/headers";
import { signJWT, verifyJWT } from "@/auth/utils";

async function authenticate(formData: FormData) {
	"use server";
	const sitePassword = formData.get("sitePassword");

	if (!sitePassword) {
		return;
	}

	// doesn't need to be super secure, nothing here is sensitive, just a soft check
	const matches = sitePassword.toString() === process.env.SITE_PASSWORD;

	if (!matches) {
		return;
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
		<form
			className="flex h-screen flex-col items-center justify-center gap-2"
			action={authenticate}
		>
			<input
				className="rounded-sm border border-slate-300 p-2"
				type="password"
				placeholder="Enter site password"
				name="sitePassword"
			/>
			<button
				className="bg-yeti-400 rounded-sm px-4 py-2 text-black"
				type="submit"
			>
				Submit
			</button>
		</form>
	);
}
