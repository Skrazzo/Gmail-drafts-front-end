export interface Info {
    crawler: Job;
    publishers: Job;
    filesAvailable: string[];
}

export interface Job {
    running: boolean;
    job: string;
    started_at: string;
}
