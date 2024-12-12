import EmailContent from "@/components/ui/CreateDrafts/EmailContent";
import Filter from "@/components/ui/CreateDrafts/Filter";
import TemplateSelection from "@/components/ui/CreateDrafts/TemplateSelection";
import { AxiosResponse, DraftForm } from "@/types";
import { Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";

export default function CreateDrafts() {
	const form = useForm<DraftForm>({
		initialValues: {
			subject: "",
			body: "<p></p>",
			attachments: null,
			bodyTemplate: null,
			signatureTemplate: null,
			emails: [],
		},

		validate: {
			emails: (e) => (!e || e.length === 0) ? "Emails cannot be empty" : null,
			subject: (e) => e ? null : "Subject cannot be empty",
			// body: (e) => (e === "<p></p>" || e === null || e === "") ? "Email body cannot be empty" : null,
			bodyTemplate: (e) => e === null ? "Please select template for email body" : null,
		},
	});

	const submitHandler = async () => {
		if (!form.isValid()) {
			form.validate();
			return;
		}

		const formData = new FormData();
		const values = form.getValues();

		// add data to formdata
		Object.keys(values).forEach((key) => {
			if (Array.isArray(values[key])) {
				// Add array to formdata
				values[key].forEach((el) => {
					formData.append(key, el);
				});
			} else {
				// append value
				if (values[key] !== null && values[key] !== "null") {
					formData.append(key, values[key]);
				}
			}
		});

		try {
			const res = await axios.post<AxiosResponse<string>>("/drafts/queue/create", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			form.reset();
			if (res.data.success) {
				alert(res.data.data);
			}
		} catch (error) {
			console.error("Upload failed:", error);
		}
	};

	return (
		<>
			<Title mb={16}>Create drafts</Title>
			<Filter form={form} filteredEmails={form.values.emails} />
			<EmailContent form={form} />
			<TemplateSelection form={form} onSubmit={submitHandler} />
		</>
	);
}
