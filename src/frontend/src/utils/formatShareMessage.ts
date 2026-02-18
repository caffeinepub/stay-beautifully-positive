/**
 * Formats an affirmation message with attribution for sharing
 * @param affirmationText - The raw affirmation text to share
 * @returns Formatted string with affirmation and attribution
 */
export function formatShareMessage(affirmationText: string): string {
  return `${affirmationText}\n\n— Daily Affirmations`;
}
