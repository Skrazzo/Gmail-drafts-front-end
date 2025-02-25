import SyncTimeline from "@/components/ui/SyncPage/Timeline";
import { API_URL } from "@/global";
import { AxiosResponse } from "@/types";
import { Logs } from "@/types/Sync";
import { Button, Flex, Paper, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDatabaseExport } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import IconSyncDatabase from "@/CustomIcons/IconSyncDatabase";

export default function SyncPage() {
    const [logs, setLogs] = useState<Logs | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [exportStatus, setExportStatus] = useState<string>("");

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

    const downloadExport = async () => {
        setLoading(true);
        setExportStatus("Creating excel export, please don't close this page. This will take few minutes");

        const response = (
            await axios<AxiosResponse<{ filePath: string }>>({
                url: "/info/export", // Replace with your API endpoint
                method: "GET",
                timeout: 900000,
            })
        ).data;

        if (!response.success) {
            notifications.show({
                title: "Error",
                message: response.error,
                color: "red",
            });
            console.error(response.error);
            setExportStatus("Server error");
            return;
        }

        setLoading(false);
        // Redirect user to download
        const params = new URLSearchParams({ filePath: response.data.filePath });
        window.open(`${API_URL}/info/export/download?${params}`, "_blank");
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
                    {/*
          <Button

            loading={!logs || logs.isSyncing || loading}
            leftSection={<IconDatabaseExport />}
            variant="light"
            onClick={downloadExport}
          >
            Export
          </Button>

          <Text>{exportStatus}</Text>
          */}
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
