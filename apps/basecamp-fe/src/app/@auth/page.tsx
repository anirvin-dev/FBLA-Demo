import { verifyJWT } from "@/auth/utils";
import { cookies } from "next/headers";
import { FlipperWrapper } from "./flipper-wrapper";
import { Suspense } from "react";

export default async function AuthPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get("authToken")?.value;

	if (!token || !(await verifyJWT(token))) {
		return null;
	}

	return (
		<div className="flex h-screen flex-col items-center justify-center text-4xl">
			<h1 className="text-yeti-500 text-4xl font-bold">YETI PASS</h1>
			<Suspense fallback={<div>Loading...</div>}>
				<FlipperWrapper />
			</Suspense>
		</div>
	);
}
