import EmailListItem from "@/components/ui/EmailListItem";
import { errorMessage } from "@/global";
import { Flex, Skeleton, Table } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { EmailList } from "@/types/EmailList";

export default function Inbox() {
    const [list, setList] = useState<EmailList | null>(null);

    useEffect(() => {
        axios
            .get("/inbox/1/")
            .then((res) => {
                setList(res.data);
            })
            .catch((err) => {
                console.error(err);
                alert(errorMessage("Error appeared when fetching inbox"));
            });
    }, []);

    return (
        <>
            {list === null && (
                <Flex direction={"column"} gap={8}>
                    {new Array(6).fill(null).map((_, i) => (
                        <Skeleton key={i} h={40} />
                    ))}
                </Flex>
            )}

            {list && (
                <Table>
                    {list.messages.map((msg, idx) => {
                        console.log(msg);
                        return <EmailListItem key={idx} message={msg} />;
                    })}
                </Table>
            )}
        </>
    );
}
