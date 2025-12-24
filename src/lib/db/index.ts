import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const globalForDb = global as unknown as {
    conn: mysql.Pool | undefined;
};

const conn = globalForDb.conn ?? mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
});

if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const connection = conn;
export const db = drizzle(conn, { schema, mode: "default" });
