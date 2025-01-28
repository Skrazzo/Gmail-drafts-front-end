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
    email: string;
    person_name: string | null;
    company_name: string | null;
}

export interface EmailMetadata {
    id: number;
    company_id: number;
    company_name: string | null;
    company_type: string;
    company_input_source: string;
    company_tags: number[];
    company_logo: string | null;
    company_website: string | null;
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
    [key: string]: any;
}
