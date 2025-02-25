import { errorMessage } from "@/global";
import axios from "axios";
import { useEffect, useState } from "react";
import { EmailHeadersToGet, EmailListData, EmailListTypes } from "@/types/Emails";

import { Center, Flex, Loader, Skeleton, Table, Title } from "@mantine/core";
import EmailListItem from "@/components/ui/EmailListItem";

export default function EmailList({
    fetchUrl,
    title,
    emailType,
}: {
    fetchUrl: string;
    title: string;
    emailType: EmailListTypes;
}) {
    const [list, setList] = useState<EmailListData | null>(null);
    const [fetchingMore, setFetchingMore] = useState<boolean>(false);

    let inboxQuery: EmailHeadersToGet[0];
    switch (emailType) {
        case "inbox":
            inboxQuery = "from";
            break;
        case "sent":
            inboxQuery = "to";
            break;
    }

    function fetchList({ append = false }: { append?: boolean }) {
        if (append) setFetchingMore(true);

        axios
            .get(fetchUrl, {
                params: {
                    pageToken: list ? list.nextPageToken : null,
                },
            })
            .then((res) => {
                if (append && list !== null) {
                    let tmp = res.data; // Replace with new data
                    tmp.messages = [...list.messages, ...tmp.messages]; // append messages

                    setList(tmp);
                } else {
                    setList(res.data);
                }
            })
            .catch((err) => {
                console.error(err);
                alert(errorMessage("Error appeared when fetching inbox"));
            })
            .finally(() => {
                if (append) setFetchingMore(false);
            });
    }

    useEffect(() => {
        fetchList({});
    }, []);

    function fetchNext() {
        fetchList({ append: true });
    }

    return (
        <div className="max-w-full">
            <Title order={2} mb={16}>
                {title}
            </Title>

            {list === null && (
                <Flex direction={"column"} gap={4}>
                    {new Array(40).fill(null).map((_, i) => (
                        <Skeleton key={i} h={30} />
                    ))}
                </Flex>
            )}

            {list && (
                <Table className="email-table-list">
                    {list.messages.map((msg, idx) => {
                        // Usually fetching 40 emails at time
                        const listLength: number = list.messages.length;
                        return (
                            <EmailListItem
                                key={idx}
                                message={msg}
                                fetchTrigger={idx === listLength - (listLength > 80 ? 30 : 20)}
                                fetchNext={fetchNext}
                                headersToGet={[inboxQuery, "subject", "date"]}
                            />
                        );
                    })}
                </Table>
            )}

            {fetchingMore && (
                <Center my={16}>
                    <Loader color="blue" />
                </Center>
            )}
        </div>
    );
}
