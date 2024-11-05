export type EmailList = {
    messages: Object[];
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
};
