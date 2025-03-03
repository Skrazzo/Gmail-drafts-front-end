export type EmailListData = {
    messages: EmailListItem[];
    nextPageToken: string | null;
    resultSizeEstimate: number;
};

export type EmailHeaderInfo = {
    name: string;
    value: string;
};

export type EmailListItem = {
    id: string;
    threadId: string;
    message: {
        snippet: string;
        threadId: string;
        historyId: string;
        internalDate: string;
        labelIds: string[];
        payload: {
            headers: EmailHeaderInfo[];
        };
    };
    [key: string]: any;
};

export type EmailHeadersToGet = {
    [0]: "from" | "to";
    [1]: "subject";
    [2]: "date";
    length: 3;
};

export type EmailListTypes = "inbox" | "sent";

export interface EmailSearch {
    id: number;
    interest: null | number;
    email: string;
    country: string | null;
    person_name: string | null;
    person_position: string | null;
    company_id: string | null;
    company_name: string | null;
    company_type: string | null;
    company_tags: string | null;
    primary: number | null;
    tags: string;
    tags_id: string | null;
    last_communication_date: string | null;
}

export interface EmailInfo {
    id: number;
    person_name: string | null;
    person_position: string | null;
    met_in_person: string | null;
    interest: number | null;
    address: string | null;
    company_id: number | null;
    tags: string | null;
    email: string;
    service: string | null;
    sent_email: number | null;
    recieved_email: number | null;
    input_source: string | null;
    country: string | null;
    postal_code: string | null;
    phone_number: string | null;
    last_comment: string | null;
    last_checked: string | null;
    primary: number | null;
}

export interface EmailMetadata {
    id: number;
    company_id: number;
    company_name: string | null;
    company_type: number[];
    company_input_source: string;
    company_tags: number[];
    company_logo: string | null;
    company_website: string | null;
    company_country: string | null;
    company_postal_code: string | null;
    compant_social_media: string | null;
    email: string;
    person_name: string | null;
    person_position: string | null;
    service: string;
    sent_email: 0 | 1;
    recieved_email: 0 | 1;
    country: string;
    tags: number[];
    phone_number: string | null;
    last_comment: string | null;
    met_in_person: string | null;
    interest: number | null | "";
    last_received_date: string | null;
    last_received_subject: string | null;
    last_received_snippet: string | null;
    last_sent_date: string | null;
    last_sent_subject: string | null;
    last_sent_snippet: string | null;
    input_source: string;
    address: string | null;
    company_address: string | null;
    postal_code: string | null;
    primary: 0 | 1;
    [key: string]: any;
}
