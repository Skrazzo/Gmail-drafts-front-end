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

	const createDraftHandler = async () => {
		if(!nextInQueue) {
			alert("Cannot create 0 drafts");
			return ;
		}

		// loading
		setNext(null);

		const data = (await axios.get<AxiosResponse<string[]>>('/drafts/create', { 
			params: {
				amount: nextInQueue.length
			}, 
			timeout: 300000
		})).data;

		if(!data.success) {
			alert('Server error: ' + data.error);
			console.error(data.error);
			return;
		}

		alert("Successfully created drafts");
		fetchData();
	}

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<>
			<Title mb={16}>Queued drafts</Title>
			<QueueTable data={nextInQueue} />
			{(!nextInQueue)
				? <Button mt={16} loading>Loading</Button>
				: <Button mt={16} disabled={nextInQueue.length === 0} onClick={createDraftHandler}>Create {nextInQueue.length} drafts</Button>}
		</>
	);
}
