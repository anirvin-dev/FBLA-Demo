export async function register() {
	// Only attempt migrations in the Node.js runtime
	// eslint-disable-next-line turbo/no-undeclared-env-vars
	if (process.env.NEXT_RUNTIME !== "nodejs") {
		return;
	}

	// If there's no DATABASE_URL, skip migrations so the demo can run without Postgres
	if (!process.env.DATABASE_URL) {
		console.log("Skipping database migrations: DATABASE_URL is not set.");
		return;
	}

	try {
		console.log("Running database migrations...");
		await import("./instrumentation.node");
	} catch (error) {
		console.error("Failed to run migrations, continuing without database:", error);
	}
}
