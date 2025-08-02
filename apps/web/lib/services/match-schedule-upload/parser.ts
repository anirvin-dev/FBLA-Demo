import "server-only";

import { MalformedCsvError } from "./errors";
import { type RawCsvRow } from "./types";

import { parse } from "csv-parse";
import { z } from "zod";

const RowSchema = z.object({
	matchNumber: z.number(),
	blue1: z.number(),
	blue2: z.number(),
	blue3: z.number(),
	red1: z.number(),
	red2: z.number(),
	red3: z.number(),
});

export async function* parseCsv(csvBuffer: Buffer): AsyncGenerator<RawCsvRow> {
	const parser = parse(csvBuffer, {
		columns: true,
		skip_empty_lines: true,
		trim: true,
	});

	for await (const record of parser) {
		const parsed = RowSchema.safeParse(record);
		if (!parsed.success) {
			throw new MalformedCsvError(
				`Invalid CSV format: ${parsed.error.message}`
			);
		}

		const { matchNumber, blue1, blue2, blue3, red1, red2, red3 } =
			parsed.data;

		yield {
			matchNumber,
			blue: [blue1, blue2, blue3],
			red: [red1, red2, red3],
		};
	}
}
