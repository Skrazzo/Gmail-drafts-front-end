import SyncTimeline from "@/components/ui/SyncPage/Timeline";
import { API_URL } from "@/global";
import { AxiosResponse } from "@/types";
import { Logs } from "@/types/Sync";
import { Button, Flex, Paper, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useEffect, useState } from "react";
import IconSyncDatabase from "@/CustomIcons/IconSyncDatabase";

export default function SyncPage() {
    const [logs, setLogs] = useState<Logs | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchLogs = async () => {
        const logs = (await axios.get<AxiosResponse<Logs>>("/database/sync/logs")).data;

        if (!logs.success) {
            alert(logs.error);
            console.error(logs.error);
        } else {
            setLogs(logs.data);
        }
    };

    const syncDatabase = async () => {
        setLoading(true);
        const backupDatabase = (
            await axios.get<AxiosResponse<string>>("/database/backup", { params: { customName: "Before sync" } })
        ).data;

        if (!backupDatabase.success) {
            alert("Aborting sync: " + backupDatabase.error);
            console.error(backupDatabase.error);
            setLoading(false);
            return;
        }

        notifications.show({
            title: "Backup created",
            message: backupDatabase.data,
            color: "green",
        });

        setLoading(false);
        const syncData = (
            await axios.get<AxiosResponse<Logs>>("/database/sync", {
                headers: {
                    "Cache-Control": "no-cache",
                    Pragma: "no-cache",
                    Expires: "0",
                },
            })
        ).data;

        if (!syncData.success) {
            alert(syncData.error);
            console.error(syncData.error);
        } else {
            setLogs(syncData.data);

            setTimeout(fetchLogs, 10000);
        }
    };

    useEffect(() => {
        fetchLogs();

        const interval = setInterval(() => {
            fetchLogs();
        }, 60000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <>
            <Title>Sync</Title>
            <Paper withBorder p={"md"} mt={32}>
                <Flex gap={8} align={"center"} wrap={"wrap"}>
                    <Button
                        onClick={syncDatabase}
                        loading={!logs || logs.isSyncing || loading}
                        leftSection={<IconSyncDatabase />}
                    >
                        Sync
                    </Button>
                </Flex>
            </Paper>

            <Paper withBorder p={"md"} mt={16}>
                <Text fw={700} mb={16}>
                    Sync log timeline
                </Text>
                <SyncTimeline data={logs} />
            </Paper>
        </>
    );
}
