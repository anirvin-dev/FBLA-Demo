import { UserRole } from "@/lib/database/schema";

// DEMO-ONLY AUTH STUB
// -------------------
// The FBLA demo uses client-side/localStorage auth and does NOT require
// real Discord / NextAuth configuration. To avoid "Error: Configuration"
// when AUTH_* env vars or DATABASE_URL are missing, we provide minimal
// stub implementations here.

export const handlers: any = {
	GET: async () => new Response(null, { status: 200 }),
	POST: async () => new Response(null, { status: 200 }),
};

export const signIn: any = async () => {
	// No-op for demo; navigation is handled by server actions directly.
	return null;
};

export const signOut: any = async () => {
	// No-op for demo
	return null;
};

export const auth: any = async () => {
	// No authenticated user in demo mode; pages relying on auth
	// should gracefully handle a null session.
	return null;
};

export const providers: any = {};

declare module "next-auth" {
	interface User {
		role: UserRole;
		guildNickname: string | null;
		emailVerified: Date | null;
	}
}
