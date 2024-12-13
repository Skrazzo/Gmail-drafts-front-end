import { useForm } from "@mantine/form";
import {
	Button,
	Grid,
	Group,
	NumberInput,
	Paper,
	Select,
	SimpleGrid,
	Stack,
	Text,
	Textarea,
	TextInput,
} from "@mantine/core";
import { EmailMetadata } from "@/types";
import { countries } from "countries-list";
import TagCombobox from "@/components/ui/Tags/TagCombobox";

interface EmailFormProps {
	initialData: EmailMetadata;
	onSubmit: (values: EmailMetadata) => void;
	isReadOnly: (column: string) => boolean;
	loading: boolean;
}

export function EmailForm({ initialData, onSubmit, isReadOnly, loading }: EmailFormProps) {
	const form = useForm<EmailMetadata>({
		initialValues: initialData,
		validate: {
			interest: (value) =>
				value === null || value === "" || (value >= 0 && value <= 10)
					? null
					: "Interest must be between 0 and 10",
		},
	});

	const submitForm = () => {
		if (!form.isValid()) {
			form.validate();
			return;
		}

		// Convert tags
		const currentTags: number[] = form.values.tags || [];
		if (currentTags.length === 0) {
			form.setValues({ tags: [] });
		}

		onSubmit(form.getValues());
	};

	const countriesSelectData = () => {
		return Object.entries(countries).map(([code, country]) => {
			return {
				value: code,
				label: country.name,
			};
		});
	};

	return (
		<Paper p="md" withBorder>
			<form onSubmit={(e) => e.preventDefault()}>
				<Stack gap="md">
					<SimpleGrid cols={2}>
						{/* Contact Information */}
						<TextInput
							label="Email"
							{...form.getInputProps("email")}
							disabled={isReadOnly("email")}
						/>

						<TagCombobox form={form} />

						<TextInput
							label="Person Name"
							placeholder="Enter person name"
							{...form.getInputProps("person_name")}
							disabled={isReadOnly("person_name")}
						/>

						<Select
							label="Country"
							searchable
							clearable
							data={countriesSelectData()}
							{...form.getInputProps("country")}
							disabled={isReadOnly("country")}
						/>

						<TextInput
							label="Phone Number"
							placeholder="Enter phone number"
							{...form.getInputProps("phone_number")}
							disabled={isReadOnly("phone_number")}
						/>

						{/* Additional Information */}

						<Select
							label="Met in Person"
							placeholder="Select option"
							data={[
								{ value: "Yes", label: "Yes" },
								{ value: "No", label: "No" },
							]}
							{...form.getInputProps("met_in_person")}
							disabled={isReadOnly("met_in_person")}
							clearable
						/>

						<NumberInput
							label="Interest Level"
							placeholder="Enter interest (0-10)"
							min={0}
							max={10}
							{...form.getInputProps("interest")}
							disabled={isReadOnly("interest")}
						/>
					</SimpleGrid>

					<Textarea
						label="Comment"
						placeholder="Enter comment"
						minRows={3}
						{...form.getInputProps("last_comment")}
						disabled={isReadOnly("last_comment")}
					/>

					{/* Email Status - Read Only */}
					<Paper withBorder p="sm">
						<Text size="sm" fw={500} mb="xs">Email Status (Read Only)</Text>
						<Grid>
							<Grid.Col span={6}>
								<Text size="sm" c="dimmed">
									Sent: {initialData.sent_email ? "Yes" : "No"}
								</Text>
								<Text size="sm" c="dimmed">
									Received: {initialData.recieved_email ? "Yes" : "No"}
								</Text>
							</Grid.Col>
							<Grid.Col span={6}>
								<Text size="sm" c="dimmed">
									Last Sent: {initialData.last_sent_date || "N/A"}
								</Text>
								<Text size="sm" c="dimmed">
									Last Received: {initialData.last_received_date || "N/A"}
								</Text>
							</Grid.Col>
						</Grid>
					</Paper>

					{/* Recent Email Details - Read Only */}
					<Paper withBorder p="sm">
						<Text size="sm" fw={500} mb="xs">Recent Emails (Read Only)</Text>
						{initialData.last_sent_subject && (
							<div className="mb-3">
								<Text size="sm" fw={500}>Last Sent Email:</Text>
								<Text size="sm" c="dimmed">Subject: {initialData.last_sent_subject}</Text>
								<Text size="sm" c="dimmed">Snippet: {initialData.last_sent_snippet}</Text>
							</div>
						)}
						{initialData.last_received_subject && (
							<div>
								<Text size="sm" fw={500}>Last Received Email:</Text>
								<Text size="sm" c="dimmed">Subject: {initialData.last_received_subject}</Text>
								<Text size="sm" c="dimmed">Snippet: {initialData.last_received_snippet}</Text>
							</div>
						)}
					</Paper>

					<Group>
						<Button type="submit" loading={loading} onClick={submitForm}>
							Save Changes
						</Button>
					</Group>
				</Stack>
			</form>
		</Paper>
	);
}
