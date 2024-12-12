export interface Logs {
    logs: {
        id: number;
        ran_at: string;
        finished_at: string;
    }[];
    isSyncing: boolean;
}