import { EmailSearch } from "@/types";
import type { Filter } from "@/pages/Email/AdvancedSearchModal";
import SearchParamsHelper from "@/helpers/SearchParamsHelper";
import stringTagsToArray from "./stringTagsToArray";
import dayjs from "dayjs";

export function AdvancedFilter(emails: EmailSearch[], params: SearchParamsHelper): EmailSearch[] {
    const f: Filter = {
        ct: params.getIds("ct"),
        hct: params.getBoolean("hct"),
        et: params.getIds("et"),
        het: params.getBoolean("het"),
        cty: params.getIds("cty"),
        hcty: params.getBoolean("hcty"),
        date: params.get("date"),
        dbe: params.getBoolean("dbe"),
        dhcom: params.getBoolean("dhcom"),
        e1: params.getBoolean("e1"),
    };

    const filteredCompanies = new Set<number>([]);

    // For tracking primary emails when using e1 filter
    const companyToPrimaryMap = new Map<number, EmailSearch>();
    const result: EmailSearch[] = [];

    // First pass: collect all emails that pass the filters
    let filteredEmails = emails.filter((e) => {
        // If there are company type filters applied
        if (f.cty.length > 0) {
            const ids = stringTagsToArray(e.company_type || "");
            if (f.hcty) {
                // If we *must* have at least one of these types, but don't
                if (!f.cty.some((type) => ids.includes(type))) {
                    return false;
                }
            } else {
                // If we *must not* have any of these types, but do
                if (f.cty.some((type) => ids.includes(type))) {
                    return false;
                }
            }
        }

        // filter company tag
        if (f.ct.length > 0) {
            const ids = stringTagsToArray(e.company_tags || "");

            if (f.hct) {
                // company tag must be on of these
                if (!f.ct.some((tag) => ids.includes(tag))) {
                    return false;
                }
            } else {
                // company tag MUST NOT BE one of these
                if (f.ct.some((tag) => ids.includes(tag))) {
                    return false;
                }
            }
        }

        // filter email tag
        if (f.et.length > 0) {
            const ids = stringTagsToArray(e.tags_id || "");
            if (f.het) {
                // email tag must be on of these
                if (!f.et.some((tag) => ids.includes(tag))) {
                    return false;
                }
            } else {
                // email tag MUST NOT BE one of these
                if (f.et.some((tag) => ids.includes(tag))) {
                    return false;
                }
            }
        }

        // filter date
        if (f.date) {
            // Get all emails from the same company
            let latestCommunication = dayjs(e.last_communication_date || "1970-01-01");
            const companyEmails = emails.filter((eRow) => eRow.company_id === e.company_id);

            // Get last email from the company
            companyEmails.forEach((companyEmail) => {
                const lastCom = dayjs(companyEmail.last_communication_date);
                if (lastCom.isAfter(latestCommunication)) {
                    latestCommunication = lastCom;
                }
            });

            const filterDate = dayjs(f.date);
            const diff = filterDate.diff(latestCommunication, "day");

            if (f.dbe) {
                // Last communication needs to be before this date
                if (diff <= 0) {
                    return false;
                }
            } else {
                // Last communication needs to be after this date
                if (diff >= 0) {
                    return false;
                }
            }
        }

        // Filter "Doesnt have communication"
        if (f.dhcom) {
            if (e.last_communication_date) {
                return false;
            }
        }

        // For all other filters, this email passes
        return true;
    });

    // Second pass: handle the company uniqueness and primary email logic
    if (f.e1) {
        // First, collect primary emails for each company
        for (const email of filteredEmails) {
            if (!email.company_id) continue;

            const companyId = Number(email.company_id);

            // If this is a primary email, store it in our map
            if (email.primary) {
                companyToPrimaryMap.set(companyId, email);
            }
        }

        // Now process all emails, preferring primary ones
        for (const email of filteredEmails) {
            if (!email.company_id) continue;

            const companyId = Number(email.company_id);

            // If we've already added an email for this company, skip
            if (filteredCompanies.has(companyId)) {
                continue;
            }

            // Add this company to our set
            filteredCompanies.add(companyId);

            // If there's a primary email for this company, use that instead
            const primaryEmail = companyToPrimaryMap.get(companyId);
            if (primaryEmail) {
                result.push(primaryEmail);
            } else {
                // Otherwise use this email
                result.push(email);
            }
        }

        filteredEmails = result;
    }

    // After all filtering is done, we return filtered emails
    return filteredEmails;
}
