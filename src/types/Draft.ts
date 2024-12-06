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
