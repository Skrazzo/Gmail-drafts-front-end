export interface ActionHistory {
    id: number;
    action: string;
    type:
        | "message"
        | "queue"
        | "email_info_update"
        | "company_updated"
        | "company_created"
        | "cleaned_companies"
        | "cleaned_types"
        | "cleaned_tags"
        | "added_tracker_tags"
        | "separated_mailboxes"
        | "linked_cc_emails"
        | null;
    sub_category: string | null;
    created_at: string | null;
}
