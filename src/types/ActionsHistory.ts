export interface ActionHistory {
    id: number;
    action: string;
    type: "message" | "queue" | "email_info_update" | "company_updated" | null;
    sub_category: string | null;
    created_at: string | null;
}
