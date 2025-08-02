export interface RawCsvRow {
	matchNumber: number;
	blue: [number, number, number];
	red: [number, number, number];
}

export interface UploadResult {
	teamsInserted: number;
	matchesInserted: number;
	teamMatchesInserted: number;
}

export interface UploadOptions {
	eventCode: string;
	csvBuffer: Buffer;
}
