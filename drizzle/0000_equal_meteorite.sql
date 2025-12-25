CREATE TABLE `image_operations` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`file_name` varchar(500) NOT NULL,
	`file_hash` varchar(64),
	`original_size_bytes` bigint NOT NULL,
	`processed_size_bytes` bigint,
	`resolution_origin` varchar(20),
	`resolution_result` varchar(20),
	`operation_type` enum('upscale','downscale') NOT NULL,
	`scale_factor` enum('2','4','8') NOT NULL,
	`algorithm_used` varchar(50),
	`quality_mode` enum('fast','balanced','quality') DEFAULT 'balanced',
	`status` enum('queued','processing','completed','failed','cancelled') DEFAULT 'queued',
	`error_message` text,
	`processing_time_ms` int,
	`progress` int DEFAULT 0,
	`storage_path_original` varchar(500),
	`storage_path_processed` varchar(500),
	`metadata` json,
	`is_deleted` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`started_at` timestamp,
	`completed_at` timestamp,
	`expires_at` timestamp,
	CONSTRAINT `image_operations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `processing_queue` (
	`queue_id` varchar(36) NOT NULL,
	`operation_id` varchar(36) NOT NULL,
	`priority` int DEFAULT 10,
	`retry_count` int DEFAULT 0,
	`max_retries` int DEFAULT 3,
	`worker_id` varchar(100),
	`locked_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `processing_queue_queue_id` PRIMARY KEY(`queue_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`full_name` varchar(255),
	`avatar_url` text,
	`total_processed` int DEFAULT 0,
	`storage_used_bytes` bigint DEFAULT 0,
	`tier` enum('FREE','PRO','ENTERPRISE') DEFAULT 'FREE',
	`preferences` json,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`last_active_at` timestamp,
	CONSTRAINT `users_user_id` PRIMARY KEY(`user_id`),
	CONSTRAINT `email_idx` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `image_operations` (`user_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `image_operations` (`status`);--> statement-breakpoint
CREATE INDEX `file_hash_idx` ON `image_operations` (`file_hash`);--> statement-breakpoint
CREATE INDEX `priority_idx` ON `processing_queue` (`priority`,`created_at`);--> statement-breakpoint
CREATE INDEX `locked_at_idx` ON `processing_queue` (`locked_at`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `users` (`created_at`);