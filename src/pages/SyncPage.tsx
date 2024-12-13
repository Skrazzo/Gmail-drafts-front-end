import SyncTimeline from "@/components/ui/SyncPage/Timeline";
import { AxiosResponse } from "@/types";
import { Logs } from "@/types/Sync";
import { Button, Flex, Paper, Text, Title } from "@mantine/core";
import { IconDatabaseExport, IconDatabaseImport } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";

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
		const syncData = (await axios.get<AxiosResponse<Logs>>("/database/sync", {
			headers: {
				"Cache-Control": "no-cache",
				"Pragma": "no-cache",
				"Expires": "0",
			},
		})).data;

		if (!syncData.success) {
			alert(syncData.error);
			console.error(syncData.error);
		} else {
			setLogs(syncData.data);

			setTimeout(fetchLogs, 10000);
		}
	};

	const downloadExport = async () => {
		try {
			setLoading(true);
			// Make API request with axios
			const response = await axios({
				url: "/info/export", // Replace with your API endpoint
				method: "GET",
				responseType: "blob", // Important for handling file downloads
				timeout: 300000,
			});

			// Create a blob from the response data
			const blob = new Blob([response.data], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			// Create a temporary URL for the blob
			const url = window.URL.createObjectURL(blob);

			// Create a temporary link element
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "export.xlsx"); // Set desired filename

			// Programmatically click the link to trigger download
			document.body.appendChild(link);
			link.click();

			// Clean up
			window.URL.revokeObjectURL(url);
			document.body.removeChild(link);
		} catch (error) {
			console.error("Export failed:", error);
			// Handle error appropriately - you might want to show a toast notification
		} finally {
			setLoading(false);
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
			<Title>Sync and export data</Title>
			<Paper withBorder p={"md"} mt={32}>
				<Flex gap={8}>
					<Button
						onClick={syncDatabase}
						loading={!logs || logs.isSyncing || loading}
						leftSection={<IconDatabaseImport />}
					>
						Sync
					</Button>
					<Button
						loading={!logs || logs.isSyncing || loading}
						leftSection={<IconDatabaseExport />}
						variant="light"
						onClick={downloadExport}
					>
						Export
					</Button>
				</Flex>
			</Paper>

			<Paper withBorder p={"md"} mt={16}>
				<Text fw={700} mb={16}>Sync log timeline</Text>
				<SyncTimeline data={logs} />
			</Paper>
		</>
	);
}
