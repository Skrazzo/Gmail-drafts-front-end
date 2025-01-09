import { QueuedDrafts } from "@/types";
import { Center, Flex, Paper, Skeleton, Table, Text, Title } from "@mantine/core";
import { IconMailboxOff } from "@tabler/icons-react";
import moment from "moment";

export default function QueueTable({ data }: { data: QueuedDrafts['queue'] | null | undefined }) {
	// Null
	if (!data) {
		return (
			<Flex gap={8} direction={"column"}>
				{new Array(10).fill(null).map((_data, idx) => <Skeleton w={"100%"} h={32} key={idx} />)}
			</Flex>
		);
	}

	// Result is empty
	if (data.length === 0) {
		return (
			<Paper withBorder>
				<Center h={350}>
					<Flex direction={"column"} gap={8} align={"center"}>
						<IconMailboxOff size={96} strokeWidth={1.5} color="#4A72FF" />
						<Title maw={250}>No drafts found</Title>
						<Text c="dimmed" maw={300} className="text-center">
							If you want to send drafts, you need to create them first
						</Text>
					</Flex>
				</Center>
			</Paper>
		);
	}

	const tableHeaders = (
		<Table.Tr>
			<Table.Th>Email to</Table.Th>
			<Table.Th>Subject</Table.Th>
			<Table.Th>Attachments</Table.Th>
			<Table.Th>Created date</Table.Th>
		</Table.Tr>
	);

	const tableRows = data.map((row, idx) => (
		<Table.Tr key={idx}>
			<Table.Td>{row.email_to}</Table.Td>
			<Table.Td>{row.email_subject}</Table.Td>
			<Table.Td>
				{row.attachments ? row.attachments : <Text c="dimmed" fs={"italic"}>No attachments</Text>}
			</Table.Td>
			<Table.Td>{moment(row.updated_at).format("YYYY-MM-DD HH:mm")}</Table.Td>
		</Table.Tr>
	));

	return (
		<Table>
			<Table.Thead>{tableHeaders}</Table.Thead>
			<Table.Tbody>{tableRows}</Table.Tbody>
		</Table>
	);
}
