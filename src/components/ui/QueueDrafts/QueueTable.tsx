import { QueuedDrafts, Tag } from "@/types";
import { Center, Checkbox, Flex, Loader, Paper, Skeleton, Table, Text, Title, Tooltip } from "@mantine/core";
import { IconMailboxOff } from "@tabler/icons-react";
import dayjs from "dayjs";
import moment from "moment";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export type SendInfo = SendYes | SendNo;

interface SendBase {
    email: string;
    queueId: number;
    checked: boolean; // Determins if checked
}

interface SendYes extends SendBase {
    send: true; // Determins if initial state is error or not
}

interface SendNo extends SendBase {
    send: false;
    type: "error" | "warning";
    reason: string;
}

export default function QueueTable({
    nextInQueue,
    setSelectedIds,
}: {
    nextInQueue: QueuedDrafts | null;
    setSelectedIds: Dispatch<SetStateAction<number[]>>;
}) {
    const [sendInfo, setSendInfo] = useState<SendInfo[]>([]);

    function checkForTag(tags: Tag[], tagIds: number[], badTag: string): boolean {
        const found = tags.find((t) => t.name.toLowerCase() === badTag);
        if (!found) return false;
        if (tagIds.includes(found.id)) return true;
        return false;
    }

    async function checkEmails(queue: QueuedDrafts["queue"]) {
        let tmp: SendInfo[] = [];

        for (const email of queue) {
            // Insert checking logic here
            let send = true;

            // Check unsubscribe
            if (email.unsubscribed) {
                tmp.push({
                    send: false,
                    checked: false,
                    email: email.email_to,
                    type: "error",
                    queueId: email.id,
                    reason: email.unsubcribe_reason ? email.unsubcribe_reason : "Person is in unsubcribe list",
                });

                continue;
            }

            // TODO: Replace bad tag name

            const badTags = [`reviewed${dayjs().year()}`, `bologna${dayjs().year()}`];

            // Check for tags
            if (nextInQueue?.tags && email.data?.tags) {
                for (const badTag of badTags) {
                    if (checkForTag(nextInQueue.tags, email.data.tags, badTag)) {
                        tmp.push({
                            send: false,
                            checked: false,
                            type: "error",
                            reason: `Contains REVIEWED2025 tag`,
                            email: email.email_to,
                            queueId: email.id,
                        });

                        continue;
                    }
                }
            }

            // Check company tags
            if (nextInQueue?.tags && email.data?.company_tags) {
                for (const badTag of badTags) {
                    if (checkForTag(nextInQueue.tags, email.data.company_tags, badTag)) {
                        tmp.push({
                            send: false,
                            checked: true,
                            type: "error",
                            reason: `Company contains REVIEWED2025 tag`,
                            email: email.email_to,
                            queueId: email.id,
                        });

                        continue;
                    }
                }
            }

            // Warning after errors

            // Check for communication date
            if (email.data?.last_communication_date) {
                const last = dayjs(email.data.last_communication_date);
                const diff = dayjs().diff(last, "day");

                if (diff < 60) {
                    tmp.push({
                        send: false,
                        checked: true,
                        email: email.email_to,
                        type: "warning",
                        queueId: email.id,
                        reason: `Last communication date was ${diff} days ago`,
                    });
                    continue;
                }
            }

            tmp.push({ send, checked: true, email: email.email_to, queueId: email.id });
        }

        setSendInfo(tmp);
    }

    useEffect(() => {
        if (nextInQueue) {
            checkEmails(nextInQueue.queue);
        }
    }, [nextInQueue]);

    useEffect(() => {
        // Update selected ids
        const ids = sendInfo.filter((i) => i.checked).map((i) => i.queueId);
        setSelectedIds(ids);
    }, [sendInfo]);

    // Null
    if (!nextInQueue) {
        return (
            <Flex gap={8} direction={"column"}>
                {new Array(10).fill(null).map((_data, idx) => (
                    <Skeleton w={"100%"} h={32} key={idx} />
                ))}
            </Flex>
        );
    }

    const data: QueuedDrafts["queue"] | null | undefined = nextInQueue.queue;

    // Result is empty
    if (data.length === 0) {
        return (
            <Paper withBorder>
                <Center h={350}>
                    <Flex direction={"column"} gap={8} align={"center"}>
                        <IconMailboxOff size={96} strokeWidth={1.5} color="#4A72FF" />
                        <Title maw={250}>{nextInQueue.totalInQueue > 0 ? "Gmail is full" : "Queue is empty"}</Title>
                        <Text c="dimmed" maw={300} className="text-center">
                            {nextInQueue.totalInQueue > 0
                                ? "Send out drafts in your gmail account and next in queue will appear here"
                                : "If you want to send drafts, you need to create them first"}
                        </Text>
                    </Flex>
                </Center>
            </Paper>
        );
    }

    const tableHeaders = (
        <Table.Tr>
            <Table.Th></Table.Th>
            <Table.Th>From</Table.Th>
            <Table.Th>Email to</Table.Th>
            <Table.Th>Subject</Table.Th>
            <Table.Th>Attachments</Table.Th>
            <Table.Th>Created date</Table.Th>
        </Table.Tr>
    );

    function handleCheckboxChange(idx: number) {
        // Update sendInfo
        let tmp = [...sendInfo];
        tmp[idx].checked = !tmp[idx].checked;
        setSendInfo(tmp);
    }

    const tableRows = data.map((row, idx) => (
        <>
            {(() => {
                const checked = sendInfo.find((i) => i.email.toLowerCase() === row.email_to.toLowerCase());
                if (!checked) return <></>;

                return (
                    <Table.Tr
                        key={idx}
                        c={
                            !checked.send
                                ? checked.type === "warning"
                                    ? "orange"
                                    : checked.type === "error"
                                      ? "red"
                                      : ""
                                : ""
                        }
                    >
                        <Table.Td>
                            {checked === undefined ? (
                                <Loader size={16} type="dots" />
                            ) : (
                                <Checkbox checked={checked.checked} onChange={() => handleCheckboxChange(idx)} />
                            )}
                        </Table.Td>

                        <Table.Td>{row.email_from}</Table.Td>
                        <Tooltip
                            bg={
                                !checked.send
                                    ? checked.type === "warning"
                                        ? "orange"
                                        : checked.type === "error"
                                          ? "red"
                                          : ""
                                    : ""
                            }
                            label={!checked.send ? checked.reason : ""}
                            hidden={checked.send}
                            withArrow
                        >
                            <Table.Td>{row.email_to}</Table.Td>
                        </Tooltip>
                        <Table.Td>{row.email_subject}</Table.Td>
                        <Table.Td>
                            {row.attachments ? (
                                row.attachments
                            ) : (
                                <Text c="dimmed" fs={"italic"}>
                                    No attachments
                                </Text>
                            )}
                        </Table.Td>
                        <Table.Td>{moment(row.updated_at).format("YYYY-MM-DD HH:mm")}</Table.Td>
                    </Table.Tr>
                );
            })()}
        </>
    ));

    return (
        <Table>
            <Table.Thead>{tableHeaders}</Table.Thead>
            <Table.Tbody>{tableRows}</Table.Tbody>
        </Table>
    );
}
