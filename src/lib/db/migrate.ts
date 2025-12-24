import { migrate } from "drizzle-orm/mysql2/migrator";
import { db, connection } from "./index";

async function main() {
    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations completed!");
    await connection.end();
}

main().catch((err) => {
    console.error("Migration failed!", err);
    process.exit(1);
});
