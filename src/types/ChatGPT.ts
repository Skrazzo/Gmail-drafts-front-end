export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface PromptBatch {
  id: string;
  prompt: string;
  dateRange: DateRange;
  status: 'running' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  result?: string;
}

export interface ChatGPTPromptRequest {
  prompt: string;
  dateRange?: DateRange;
}