import { db } from "./db";
import { analyticsEvents } from "../../drizzle/schema";
import { and, eq, gte, sql } from "drizzle-orm";
import { createHash } from "crypto";

/**
 * Anonymous "taste the product" service.
 *
 * Lets an unauthenticated visitor have a small number of free voice turns
 * before the signup wall, so they experience value before being asked to
 * create an account. Each turn costs real money (Whisper + GPT-4o + Cartesia),
 * so we rate-limit by hashed client IP within a rolling window.
 *
 * Usage is tracked as `anon_turn` rows in `analytics_events` (metadata = ip hash)
 * to avoid a schema change.
 */

// How many free turns an anonymous visitor gets per IP per window.
export const ANON_FREE_TURNS = 1;

// Rolling window for the free-turn allowance.
const WINDOW_HOURS = 24;

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(headers: Headers): string {
	const xff = headers.get("x-forwarded-for");
	if (xff) return xff.split(",")[0].trim();
	return headers.get("x-real-ip") || "unknown";
}

/** One-way hash so we never store raw IPs. */
export function hashIp(ip: string): string {
	const salt = process.env.ANON_SALT || "ttyc-anon-v1";
	return createHash("sha256").update(salt + ip).digest("hex");
}

/** Number of anonymous turns this IP has used inside the current window. */
export async function anonTurnsUsed(ipHash: string): Promise<number> {
	const since = new Date(Date.now() - WINDOW_HOURS * 60 * 60 * 1000);
	const rows = await db
		.select({ count: sql<number>`count(*)` })
		.from(analyticsEvents)
		.where(
			and(
				eq(analyticsEvents.eventType, "anon_turn"),
				eq(analyticsEvents.metadata, ipHash),
				gte(analyticsEvents.createdAt, since)
			)
		);
	return Number(rows[0]?.count) || 0;
}

/** Record that this IP consumed one anonymous free turn. */
export async function recordAnonTurn(ipHash: string): Promise<void> {
	try {
		await db.insert(analyticsEvents).values({
			userId: null,
			eventType: "anon_turn",
			metadata: ipHash,
		});
	} catch (error) {
		// Never block the main flow on analytics writes.
		console.error("Failed to record anon turn:", error);
	}
}
