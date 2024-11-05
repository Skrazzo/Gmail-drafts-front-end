type EmailMessageType = {
    messages: Object[];
    last: { [key: string]: any };
};

export type EmailInfo = {
    incoming: EmailMessageType;
    outgoing: EmailMessageType;
};
