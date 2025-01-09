export interface DraftForm {
	subject: string;
	body: string;
	emails: string[];
	attachments: File | File[] | null;
	bodyTemplate: null | string;
	signatureTemplate: null | string;
	[key: string]: any;
}

export interface AvailableTemplates {
	bodies: string[];
	signatures: string[];
}

export interface QueuedDrafts {
	totalInQueue:number;
	draftsInGmail:number;
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
