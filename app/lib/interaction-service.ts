import { db } from "./db";
import { interactions, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import type { Session } from '@supabase/supabase-js';

/**
 * Interaction tracking service
 * Handles user management and interaction logging
 */
class InteractionService {
	/**
	 * Ensures a user exists in our users table and creates an interaction entry
	 */
	async trackInteraction(session: Session | null): Promise<string | null> {
		if (!session?.user?.id) {
			console.warn("No authenticated user found for interaction tracking");
			return null;
		}

		try {
			// Ensure user exists in our users table
			await this.ensureUserExists(session.user.id, session.user.email);

			// Create interaction entry
			const interactionId = await this.createInteraction(session.user.id);
			
			console.log(`Created interaction ${interactionId} for user ${session.user.id}`);
			return interactionId;
		} catch (error) {
			console.error("Failed to track interaction:", error);
			// Don't fail the request if interaction tracking fails
			return null;
		}
	}

	/**
	 * Ensures a user exists in our users table
	 */
	private async ensureUserExists(userId: string, email?: string): Promise<void> {
		try {
			await db.insert(users).values({
				id: userId,
				email: email || null,
			}).onConflictDoNothing();
		} catch (error) {
			console.error("Failed to ensure user exists:", error);
			throw error;
		}
	}

	/**
	 * Creates a new interaction entry for a user
	 */
	private async createInteraction(userId: string): Promise<string> {
		try {
			const [interaction] = await db.insert(interactions).values({
				userId: userId,
			}).returning({ id: interactions.id });
			
			return interaction.id;
		} catch (error) {
			console.error("Failed to create interaction:", error);
			throw error;
		}
	}

	/**
	 * Get interaction statistics for a user (optional utility method)
	 */
	async getUserInteractionCount(userId: string): Promise<number> {
		try {
			const result = await db
				.select({ count: interactions.id })
				.from(interactions)
				.where(eq(interactions.userId, userId));
			
			return result.length;
		} catch (error) {
			console.error("Failed to get user interaction count:", error);
			return 0;
		}
	}
}

// Export as singleton
export const interactionService = new InteractionService(); 