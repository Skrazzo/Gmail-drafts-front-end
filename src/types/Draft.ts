import { Tag, Type } from "./Api";
import { EmailMetadata } from "./Emails";

export interface DraftForm {
    subject: string;
    body: string;
    emails: string[];
    email_from: string;
    mark_tag: string;
    steps: string[];
    stepsRepeat: number;
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

export interface AvailableFromEmails {
    email: string;
    type: string;
    isDefault: boolean;
    name: string; // can be empty
}

export interface QueuedDrafts {
    totalInQueue: number;
    draftsInGmail: number;
    queue: {
        id: number;
        unsubscribe_id: number;
        data: EmailMetadata | undefined;
        email_to: string;
        email_from: string;
        email_body: string;
        email_subject: string;
        attachments: string;
        updated_at: string;
        unsubscribed?: boolean;
        unsubcribe_reason?: string;
    }[];
    tags: Tag[];
    types: Type[];
}
