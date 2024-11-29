import { formatEmailListDate, getSenderName } from "@/functions/emailData";
import { getHeaderInfo } from "@/functions/getHeaderInfo";
import useOnScreen from "@/hooks/useOnScreen";
import { EmailHeadersToGet, EmailListItem as EmailListItemType } from "@/types/EmailList";
import { Table } from "@mantine/core";
import { useEffect, useRef } from "react";

export default function EmailListItem({
	message,
	fetchTrigger = false,
	fetchNext = () => {},
	headersToGet = ["from", "subject", "date"],
}: {
	message: EmailListItemType;
	fetchTrigger?: boolean;
	fetchNext?: () => void;
	headersToGet?: EmailHeadersToGet;
}) {
	const tableRowRef = useRef<HTMLTableRowElement>(null);
	const isVisible = useOnScreen(tableRowRef);
	const fetched = useRef<boolean>(false);

	useEffect(() => {
		if (!fetchTrigger) return;
		if (!isVisible) return;
		if (fetched.current) return;

		fetchNext();
		fetched.current = true;
	}, [isVisible]);

	const msg = message.message;

	return (
		<Table.Tr ref={tableRowRef}>
			<Table.Td>
				{getSenderName(
					getHeaderInfo(msg.payload.headers, headersToGet[0]),
				)}
			</Table.Td>
			<Table.Td className="info-container">
				<div className="info">
					<b>{getHeaderInfo(msg.payload.headers, headersToGet[1])}</b>
					{" - "}
					{msg.snippet}
				</div>
			</Table.Td>
			<Table.Td>
				{formatEmailListDate(
					getHeaderInfo(msg.payload.headers, headersToGet[2]),
				)}
			</Table.Td>
		</Table.Tr>
	);
}
