import { getHeaderInfo } from "@/functions/getHeaderInfo";
import { EmailListItem as EmailListItemType } from "@/types/EmailList";
import { Table } from "@mantine/core";

export default function EmailListItem({
    message,
}: {
    message: EmailListItemType;
}) {
    const msg = message.message;
    return (
        <Table.Tr>
            <Table.Td>{getHeaderInfo(msg.payload.headers, "subject")}</Table.Td>
            <Table.Td>{getHeaderInfo(msg.payload.headers, "from")}</Table.Td>
            <Table.Td>{msg.snippet}</Table.Td>
        </Table.Tr>
    );
}
