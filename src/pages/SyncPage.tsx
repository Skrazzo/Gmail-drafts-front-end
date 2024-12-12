import SyncTimeline from "@/components/ui/SyncPage/Timeline";
import { AxiosResponse } from "@/types";
import { Logs } from "@/types/Sync";
import { Button, Flex, Paper, Text, Title } from "@mantine/core";
import { IconDatabaseExport, IconDatabaseImport } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function SyncPage() {
	const [logs, setLogs] = useState<Logs | null>(null);

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
						loading={!logs || logs.isSyncing}
						leftSection={<IconDatabaseImport />}
					>
						Sync
					</Button>
					<Button loading={!logs || logs.isSyncing} leftSection={<IconDatabaseExport />} variant="light">
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
