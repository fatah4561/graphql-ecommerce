// a script to load .env values to encore secret
import { execSync } from "child_process";
import { parse } from "dotenv";
import { readFileSync } from "fs";

const env = parse(readFileSync(".env"));

const secretKeys = {
    auth: ["JWK_PUBLIC_KEY", "JWK_PRIVATE_KEY"],

    // payment gateway
    ipaymu: ["VA_KEY", "API_KEY"],
    midtrans: ["MIDTRANS_CLIENT_ID", "MIDTRANS_SERVER_KEY"],
    stripe: []
}

for (const section in secretKeys) {
    const keys = secretKeys[section as keyof typeof secretKeys];

    if (!Array.isArray(keys)) {
        console.warn(`🟠 Unexpected format for ${section}, expected an array`);
        continue;
    }

    for (const key of keys) {
        const value = env[key];

        console.log(`🔐 Setting Encore secret: ${key}`);
        if (!value) {
            console.warn("🟠 Key skipped, value is empty or undefined");
        } else {
            execSync(`echo "${value}" | encore secret set --type dev,local ${key}`, {
                stdio: "inherit",
            });
        }
    }
}
