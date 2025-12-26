import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const globalForDb = global as unknown as {
    conn: mysql.Pool | undefined;
    drizzleDb: MySql2Database<typeof schema> | undefined;
};

// Lazy initialization to ensure env vars are loaded
function getConnection(): mysql.Pool {
    if (!globalForDb.conn) {
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            throw new Error("DATABASE_URL environment variable is not set");
        }
        globalForDb.conn = mysql.createPool(dbUrl);
    }
    return globalForDb.conn;
}

function getDb(): MySql2Database<typeof schema> {
    if (!globalForDb.drizzleDb) {
        globalForDb.drizzleDb = drizzle(getConnection(), { schema, mode: "default" });
    }
    return globalForDb.drizzleDb;
}

export const connection = {
    get pool() {
        return getConnection();
    }
};

// Use getter to ensure lazy initialization
export const db = new Proxy({} as MySql2Database<typeof schema>, {
    get(_, prop) {
        return (getDb() as any)[prop];
    }
});


