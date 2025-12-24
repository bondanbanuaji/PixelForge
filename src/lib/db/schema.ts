import {
    mysqlTable,
    varchar,
    int,
    text,
    timestamp,
    mysqlEnum,
    bigint,
    json,
    boolean,
    index,
    uniqueIndex,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

// Users table (mirrors Clerk data)
export const users = mysqlTable(
    "users",
    {
        userId: varchar("user_id", { length: 255 }).primaryKey(),
        email: varchar("email", { length: 255 }).notNull(),
        fullName: varchar("full_name", { length: 255 }),
        avatarUrl: text("avatar_url"),
        totalProcessed: int("total_processed").default(0),
        storageUsedBytes: bigint("storage_used_bytes", { mode: "number" }).default(0),
        tier: mysqlEnum("tier", ["FREE", "PRO", "ENTERPRISE"]).default("FREE"),
        preferences: json("preferences"),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").onUpdateNow(),
        lastActiveAt: timestamp("last_active_at"),
    },
    (table) => ({
        emailIdx: uniqueIndex("email_idx").on(table.email),
        createdAtIdx: index("created_at_idx").on(table.createdAt),
    })
);

// Image operations table
export const imageOperations = mysqlTable(
    "image_operations",
    {
        id: varchar("id", { length: 36 }).primaryKey(),
        userId: varchar("user_id", { length: 255 }).notNull(),
        fileName: varchar("file_name", { length: 500 }).notNull(),
        fileHash: varchar("file_hash", { length: 64 }),
        originalSizeBytes: bigint("original_size_bytes", { mode: "number" }).notNull(),
        processedSizeBytes: bigint("processed_size_bytes", { mode: "number" }),
        resolutionOrigin: varchar("resolution_origin", { length: 20 }),
        resolutionResult: varchar("resolution_result", { length: 20 }),
        operationType: mysqlEnum("operation_type", ["upscale", "downscale"]).notNull(),
        scaleFactor: mysqlEnum("scale_factor", ["2", "4", "8"]).notNull(),
        algorithmUsed: varchar("algorithm_used", { length: 50 }),
        qualityMode: mysqlEnum("quality_mode", ["fast", "balanced", "quality"]).default("balanced"),
        status: mysqlEnum("status", [
            "queued",
            "processing",
            "completed",
            "failed",
            "cancelled",
        ]).default("queued"),
        errorMessage: text("error_message"),
        processingTimeMs: int("processing_time_ms"),
        progress: int("progress").default(0),
        storagePathOriginal: varchar("storage_path_original", { length: 500 }),
        storagePathProcessed: varchar("storage_path_processed", { length: 500 }),
        metadata: json("metadata"),
        isDeleted: boolean("is_deleted").default(false),
        createdAt: timestamp("created_at").defaultNow(),
        startedAt: timestamp("started_at"),
        completedAt: timestamp("completed_at"),
        expiresAt: timestamp("expires_at"),
    },
    (table) => ({
        userIdIdx: index("user_id_idx").on(table.userId),
        statusIdx: index("status_idx").on(table.status),
        fileHashIdx: index("file_hash_idx").on(table.fileHash),
    })
);

// Processing queue table (persisting jobs)
export const processingQueue = mysqlTable(
    "processing_queue",
    {
        queueId: varchar("queue_id", { length: 36 }).primaryKey(),
        operationId: varchar("operation_id", { length: 36 }).notNull(),
        priority: int("priority").default(10),
        retryCount: int("retry_count").default(0),
        maxRetries: int("max_retries").default(3),
        workerId: varchar("worker_id", { length: 100 }),
        lockedAt: timestamp("locked_at"),
        createdAt: timestamp("created_at").defaultNow(),
    },
    (table) => ({
        priorityIdx: index("priority_idx").on(table.priority, table.createdAt),
        lockedAtIdx: index("locked_at_idx").on(table.lockedAt),
    })
);
