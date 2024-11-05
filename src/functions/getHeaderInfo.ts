import { EmailHeaderInfo } from "@/types/EmailList";

/**
 * Find an email header and return its value.
 *
 * @param {EmailHeaderInfo[]} headers - Email headers
 * @param {string} name - Name of header to find
 * @return {string | null} Value of the header, or null if not found
 */
export function getHeaderInfo(
    headers: EmailHeaderInfo[],
    name: string
): string | null {
    let tmp = headers.find((h) => h.name.toLowerCase() === name.toLowerCase()); // Find header
    if (tmp === undefined) return null; // If not found, return null
    return tmp.value || null; // If found, return value, otherwise null
}
