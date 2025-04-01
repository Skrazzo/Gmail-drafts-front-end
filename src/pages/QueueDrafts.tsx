import QueueTable from "@/components/ui/QueueDrafts/QueueTable";
import { AxiosResponse, QueuedDrafts } from "@/types";
import { Button, Flex, Text, Title, Tooltip } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import Requests from "@/functions/Requests";

export default function QueueDrafts() {
    const [nextInQueue, setNext] = useState<QueuedDrafts | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const fetchData = async () => {
        const data = (await axios.get<AxiosResponse<QueuedDrafts>>("/drafts/queue")).data;
        console.log(data);

        if (!data.success) {
            alert(`Error appeared on backend: ${data.error}`);
            console.error(data.error);
            return;
        }

        setNext(data.data);
    };

    const createDraftHandler = async () => {
        console.log(selectedIds);

        if (selectedIds.length === 0) {
            notifications.show({
                withBorder: true,
                radius: "md",
                title: "Error",
                message: `Please select drafts to add to gmail`,
            });
            return;
        }

        Requests.post({
            url: "/drafts/create",
            data: { ids: selectedIds },
            before() {
                // loading
                setNext(null);
            },
            success(_data) {
                notifications.show({
                    withBorder: true,
                    radius: "md",
                    title: "New drafts queued",
                    message: `Successfully created drafts`,
                });

                fetchData();
            },
        });
    };

    const removeQueueHandler = async () => {
        const decision = confirm("Are you sure?");
        if (!decision) {
            console.log("Deletion canceled");
            return;
        }

        setNext(null);
        const res = (await axios.delete<AxiosResponse<string>>("/queue/delete")).data;
        if (res.success) {
            // Reload
            fetchData();
        } else {
            // Error notification
            fetchData();
            notifications.show({
                withBorder: true,
                color: "red",
                radius: "md",
                title: "ERROR",
                message: `Check console -> ${res.error}`,
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Title mb={16}>Queued drafts</Title>
            <QueueTable nextInQueue={nextInQueue} setSelectedIds={setSelectedIds} />
            {!nextInQueue ? (
                <Button mt={16} loading>
                    Loading
                </Button>
            ) : (
                <Flex gap={16} mt={16} align={"center"}>
                    <Button disabled={nextInQueue.queue.length === 0} onClick={createDraftHandler}>
                        Create {selectedIds.length} drafts
                    </Button>
                    <Tooltip label={"Delete all drafts from queue"}>
                        <Button
                            disabled={nextInQueue.queue.length === 0}
                            onClick={removeQueueHandler}
                            variant="outline"
                        >
                            <IconTrash />
                        </Button>
                    </Tooltip>
                    <Text c="dimmed">{nextInQueue.totalInQueue} total drafts left</Text>
                    <Text c="dimmed">{nextInQueue.draftsInGmail} drafts are in gmail</Text>
                </Flex>
            )}
        </>
    );
}
