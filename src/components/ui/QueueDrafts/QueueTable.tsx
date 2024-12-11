import { QueuedDrafts } from "@/types";
import { Flex, Skeleton, Table, Text } from "@mantine/core";
import moment from "moment";

export default function QueueTable({ data }: { data: QueuedDrafts[] | null | undefined }) {
	if (!data || data.length <= 0) {
		return (
			<Flex gap={8} direction={"column"}>
				{new Array(10).fill(null).map((_data, idx) => <Skeleton w={"100%"} h={32} key={idx} />)}
			</Flex>
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
