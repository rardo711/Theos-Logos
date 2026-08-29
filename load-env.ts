import { config } from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";

const envLocal = resolve(process.cwd(), ".env.local");
if (existsSync(envLocal)) config({ path: envLocal });
config();
