import EmailContent from "@/components/ui/CreateDrafts/EmailContent";
import Filter from "@/components/ui/CreateDrafts/Filter";
import TemplateSelection from "@/components/ui/CreateDrafts/TemplateSelection";
import { DraftForm } from "@/types";
import { Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

export default function CreateDrafts() {
	const [emails, setEmails] = useState<string[]>([]);
	const form = useForm<DraftForm>({
		initialValues: {
			subject: "",
			body: "<p></p>",
			attachments: null,
			bodyTemplate: null,
			signatureTemplate: null,
		},

		validate: {
			subject: (e) => e ? null : "Subject cannot be empty",
			body: (e) => (e === "<p></p>" || e === null || e === "") ? "Email body cannot be empty" : null,
			bodyTemplate: (e) => e === null ? "Please select template for email body" : null,
		},
	});

	useEffect(() => {
		const interval = setInterval(() => {
			console.log(form.getValues());
		}, 2000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	const submitHandler = () => {
	};

	return (
		<>
			<Filter filteredEmails={emails} setFiltered={setEmails} />
			<EmailContent form={form} />
			<TemplateSelection form={form} onSubmit={submitHandler} />
		</>
	);
}
