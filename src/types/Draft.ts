export interface DraftForm {
    subject: string;
    body: string;
    emails: string[];
    steps: string[];
    attachments: File | File[] | null;
    bodyTemplate: null | string;
    signatureTemplate: null | string;
    [key: string]: any;
}

interface SingleDraftPreview {
    steps: false;
    data: string;
}

interface StepsDraftPreview {
    steps: true;
    data: {
        step: string;
        preview: string;
    }[];
}

export type DraftPreview = SingleDraftPreview | StepsDraftPreview;

export interface AvailableTemplates {
    bodies: string[];
    signatures: string[];
}

export interface QueuedDrafts {
    totalInQueue: number;
    draftsInGmail: number;
    queue: {
        id: number;
        unsubscribe_id: number;
        email_to: string;
        email_body: string;
        email_subject: string;
        attachments: string;
        updated_at: string;
    }[];
}
