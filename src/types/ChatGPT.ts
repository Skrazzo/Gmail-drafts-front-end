export interface DateRange {
    from: Date | null;
    to: Date | null;
}

export interface PromptBatches {
    completed: Batch[];
    failed: Batch[];
    in_progress: Batch[];
}

export interface Batch {
    id: string; // Batch id
    status: string;
    db: {
        id: number;
        prompt: string;
        processed_info: string; // JSON
        date_range: string; // JSON
        created_at: string;
    };
}

export interface BatchData {
    batch_id: string;
    date_range: [string, string];
    prompt: string;
    emails: Record<string, EmailInfo[]>; // Email as key, and then email messages in email info
}

export interface EmailInfo {
    id: number;
    subject: string;
    type: string;
    email_date: string;
    chat_gpt: string; // Response about the email
    body: string;
}

export interface ChatGPTPromptRequest {
    prompt: string;
    dateRange?: DateRange;
}
