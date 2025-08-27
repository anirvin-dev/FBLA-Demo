import * as jose from "jose";

export const signJWT = async () => {
	const token = await new jose.SignJWT({})
		.setProtectedHeader({ alg: "HS256" })
		.sign(new TextEncoder().encode(process.env.JWT_SECRET ?? ""));

	return token;
};

export const verifyJWT = async (token: string) => {
	const { payload } = await jose.jwtVerify(
		token,
		new TextEncoder().encode(process.env.JWT_SECRET ?? "")
	);

	return payload;
};
