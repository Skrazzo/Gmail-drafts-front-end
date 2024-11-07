import moment from "moment";

/**
 * Format a date string for display in the email list.
 *
 * If the date is null, return today's date.
 *
 * If the date is today, return the time of day in 12 hour format.
 *
 * Otherwise, return the date in the format "D MMM".
 *
 * @param {string | null} date - Date string to format
 * @return {string} Formatted date string
 */
export function formatEmailListDate(date: string | null): string {
    if (date === null) return moment().format("D MMM");
    let momentDate = moment(date);

    // Check if its today
    console.log(momentDate.format("H:mm"));
    if (momentDate.diff(moment(), "days") === 0) {
        return momentDate.format("H:mm");
    }
    return momentDate.format("D MMM");
}

/**
 * Extracts the sender's name from an email address string.
 *
 *
 * @param {string | null} sender - The sender email address string to extract from.
 * @return {string} The extracted sender's name or "Unknown" if not available.
 */
export function getSenderName(sender: string | null): string {
    if (!sender) return "Unknown";

    // Get name before < email >
    let matches: string[] | null = sender.match(/[^<]{1,}(?=\s*<)/gm);
    if (matches === null) return sender;

    // Get first match, and replace "
    return matches[0].replace(/"/g, "");
}
