import EmailContent from "@/components/ui/CreateDrafts/EmailContent";
import Filter from "@/components/ui/CreateDrafts/Filter";
import { DraftForm } from "@/types";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

export default function CreateDrafts() {
	const [emails, setEmails] = useState<string[]>([]);
	const form = useForm<DraftForm>({
		initialValues: {
			subject: "",
		},
	});

	useEffect(() => {
		console.log(emails);
	}, [emails]);

	return (
		<>
			<Filter filteredEmails={emails} setFiltered={setEmails} />
			<EmailContent form={form} />
		</>
	);
}
