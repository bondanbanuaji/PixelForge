import { loadEnvConfig } from "@next/env";
import { migrate } from "drizzle-orm/mysql2/migrator";

async function main() {
    // Load environment variables from .env* files
    loadEnvConfig(process.cwd());

    // Dynamically import db/index so env vars are loaded first
    const { db, connection } = await import("./index");

    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations completed!");
    await connection.end();
}

main().catch((err) => {
    console.error("Migration failed!", err);
    process.exit(1);
});
