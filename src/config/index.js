import dotenv from "dotenv";

dotenv.config();

const NEXT_PUBLIC_HOST = process.env.NEXT_PUBLIC_HOST;

export default { NEXT_PUBLIC_HOST };
