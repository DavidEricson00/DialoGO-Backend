import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const BYCRYPT_SALT_ROUNDS = process.env.BYCRYPT_SALT_ROUNDS || 10;
export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET || "super_secret";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
