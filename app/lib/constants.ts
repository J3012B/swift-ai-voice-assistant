/**
 * Application-wide constants
 */

// Subscription pricing
export const SUBSCRIPTION_PRICE = 19; // $19/month
export const ANNUAL_PRICE = 152; // $152/year (~$12.67/mo, save 33%)
export const ANNUAL_MONTHLY_EQUIVALENT = 12.67; // for display

// Free tier: conversations allowed per day (UTC) before the wall.
export const FREE_DAILY_LIMIT = 5;

// No-card free trial length, in days.
export const TRIAL_DAYS = 7;

// Deprecated: previously a lifetime cap. Kept for any lingering references.
export const FREE_TIER_LIMIT = 5;

// Feedback prompt threshold: show after this many interactions
export const FEEDBACK_PROMPT_MIN_INTERACTIONS = 3;
export const FEEDBACK_PROMPT_MAX_INTERACTIONS = 10;
