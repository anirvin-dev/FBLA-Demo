import "server-only";

import { csvRowToDbRow } from "./transformers";

import { db } from "@/lib/database";
import * as schema from "@/lib/database/schema";

export async function insertMatchSchedule(
	rows: AsyncIterable<ReturnType<typeof csvRowToDbRow>>
) {
	const counters = {
		teamsInserted: 0,
		matchesInserted: 0,
		teamMatchesInserted: 0,
	};

	/* Creates a transaction to insert the match schedule into the database. This is to ensure that the insertions are atomic, and that if any of the insertions fail, the entire operation fails. */
	await db.transaction(async (tx) => {
		for await (const {
			teamRecords,
			matchRecord,
			teamMatchRecords,
		} of rows) {
			counters.teamsInserted += await tx
				.insert(schema.team)
				.values(teamRecords)
				.onConflictDoNothing()
				.execute()
				.then((r) => r.rowCount ?? 0);

			counters.matchesInserted += await tx
				.insert(schema.match)
				.values(matchRecord)
				.onConflictDoNothing()
				.execute()
				.then((r) => r.rowCount ?? 0);

			counters.teamMatchesInserted += await tx
				.insert(schema.teamMatch)
				.values(teamMatchRecords)
				.onConflictDoNothing()
				.execute()
				.then((r) => r.rowCount ?? 0);
		}
	});

	return counters;
}
