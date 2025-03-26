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
    status: string;
    db: {
        id: number;
        prompt: string;
        processed_info: string; // JSON
        date_range: string; // JSON
        created_at: string;
    };
}

export interface ChatGPTPromptRequest {
    prompt: string;
    dateRange?: DateRange;
}

