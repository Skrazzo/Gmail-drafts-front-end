import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getInvertedEmails(originalEmails: string[], filterEmails: string[]): string[] {
    const lowerCaseFilter = new Set(filterEmails.map((email) => email.toLowerCase()));
    return originalEmails.filter((email) => !lowerCaseFilter.has(email.toLowerCase()));
}

export function openInNewTab(url: string | null | undefined) {
    if (url) {
        window.open(url, "_blank");
    }
}
