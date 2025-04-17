export interface Info {
    crawler: {
        running: boolean;
        job: string;
        started_at: string;
    };
    filesAvailable: string[];
}
