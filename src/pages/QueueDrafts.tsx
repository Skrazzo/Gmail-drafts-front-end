import QueueTable from "@/components/ui/QueueDrafts/QueueTable";
import { AxiosResponse, QueuedDrafts } from "@/types";
import { Button, Title } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";

export default function QueueDrafts() {
	const [nextInQueue, setNext] = useState<QueuedDrafts[] | null>(null);

	const fetchData = async () => {
		// Dummy data
		const data = (await axios.get<AxiosResponse<QueuedDrafts[]>>("/drafts/queue")).data;

		if (!data.success) {
			alert(`Error appeared on backend: ${data.error}`);
			console.error(data.error);
			return;
		}

		setNext(data.data);
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<>
			<Title mb={16}>Queued drafts</Title>
			<QueueTable data={nextInQueue} />
			{(!nextInQueue)
				? <Button mt={16} loading></Button>
				: <Button mt={16} disabled={nextInQueue.length === 0}>Create {nextInQueue.length} drafts</Button>}
		</>
	);
}
