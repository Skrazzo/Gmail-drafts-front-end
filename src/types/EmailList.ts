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
