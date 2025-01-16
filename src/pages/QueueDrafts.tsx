import QueueTable from "@/components/ui/QueueDrafts/QueueTable";
import { AxiosResponse, QueuedDrafts } from "@/types";
import { Button, Flex, Text, Title, Tooltip } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";

export default function QueueDrafts() {
    const [nextInQueue, setNext] = useState<QueuedDrafts | null>(null);

    const fetchData = async () => {
        const data = (await axios.get<AxiosResponse<QueuedDrafts>>("/drafts/queue")).data;

        if (!data.success) {
            alert(`Error appeared on backend: ${data.error}`);
            console.error(data.error);
            return;
        }

        setNext(data.data);
    };

    const createDraftHandler = async () => {
        if (!nextInQueue) {
            notifications.show({
                withBorder: true,
                radius: "md",
                title: "Error",
                message: `You cannot queue 0 drafts`,
            });
            return;
        }

        // loading
        setNext(null);

        const data = (
            await axios.get<AxiosResponse<string[]>>("/drafts/create", {
                params: {
                    amount: nextInQueue.queue.length,
                },
                timeout: 300000,
            })
        ).data;

        if (!data.success) {
            alert("Server error: " + data.error);
            console.error(data.error);
            return;
        }

        notifications.show({
            withBorder: true,
            radius: "md",
            title: "New drafts queued",
            message: `Successfully created drafts`,
        });

        fetchData();
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
            <QueueTable data={nextInQueue?.queue} />
            {!nextInQueue ? (
                <Button mt={16} loading>
                    Loading
                </Button>
            ) : (
                <Flex gap={16} mt={16} align={"center"}>
                    <Button disabled={nextInQueue.queue.length === 0} onClick={createDraftHandler}>
                        Create {nextInQueue.queue.length} drafts
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
