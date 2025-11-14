CREATE TABLE `contactSubmissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`service` varchar(100) NOT NULL,
	`salutation` varchar(50) NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`dateOfBirth` varchar(20) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phoneNumber` varchar(50) NOT NULL,
	`street` varchar(200) NOT NULL,
	`addressLine2` varchar(200),
	`postalCode` varchar(20) NOT NULL,
	`city` varchar(100) NOT NULL,
	`stateProvince` varchar(100),
	`country` varchar(100) NOT NULL,
	`currentResidence` varchar(100) NOT NULL,
	`preferredLanguage` varchar(50) NOT NULL,
	`message` text NOT NULL,
	`contactConsent` boolean NOT NULL,
	`privacyConsent` boolean NOT NULL,
	`submitterIp` varchar(50),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contactSubmissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `submissionRateLimits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`ipAddress` varchar(50) NOT NULL,
	`lastSubmission` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `submissionRateLimits_id` PRIMARY KEY(`id`)
);
