import { cookies } from "next/headers";
import { FlipperWrapper } from "./flipper-wrapper";
import { Suspense } from "react";
import { validateToken } from "@/lib/auth";

export default async function AuthPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get("toofaToken")?.value;

	console.log(token);
	console.log(await validateToken(token ?? ""));

	if (!token || !(await validateToken(token))) {
		return null;
	}

	return (
		<div className="flex h-screen flex-col items-center justify-center text-4xl">
			<h1 className="text-yeti-500 text-4xl font-bold">YETI PASS</h1>
			<p className="mt-2 text-sm">
				Use the code below to sign in and out.
			</p>
			<Suspense fallback={<div>Loading...</div>}>
				<FlipperWrapper />
			</Suspense>
		</div>
	);
}
