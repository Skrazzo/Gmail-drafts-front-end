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

interface EmailFormProps {
	initialData: EmailMetadata;
	onSubmit: (values: EmailMetadata) => void;
}

export function EmailForm({ initialData, onSubmit }: EmailFormProps) {
	const form = useForm<EmailMetadata>({
		initialValues: initialData,
		validate: {
			email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
			interest: (value) =>
				value === null || (value >= 0 && value <= 100) ? null : "Interest must be between 0 and 100",
		},
	});

	return (
		<Paper p="md" withBorder>
			<form onSubmit={form.onSubmit(onSubmit)}>
				<Stack gap="md">
					{/* Company Information */}
					<SimpleGrid cols={2}>
						<TextInput
							label="Company Name"
							{...form.getInputProps("company_name")}
							disabled
						/>

						<TextInput
							label="Company type"
							{...form.getInputProps("company_type")}
							disabled
						/>

						<TextInput
							label="Service"
							{...form.getInputProps("service")}
							disabled
						/>
						{/* Contact Information */}

						<TextInput
							label="Email"
							{...form.getInputProps("email")}
							disabled
						/>

						<TextInput
							label="Person Name"
							placeholder="Enter person name"
							{...form.getInputProps("person_name")}
						/>

						<TextInput
							label="Country"
							placeholder="Enter country"
							{...form.getInputProps("country")}
						/>

						<TextInput
							label="Phone Number"
							placeholder="Enter phone number"
							{...form.getInputProps("phone_number")}
						/>

						{/* Additional Information */}

						<Select
							label="Met in Person"
							placeholder="Select option"
							data={[
								{ value: "yes", label: "Yes" },
								{ value: "no", label: "No" },
							]}
							{...form.getInputProps("met_in_person")}
							clearable
						/>

						<NumberInput
							label="Interest Level"
							placeholder="Enter interest (0-10)"
							min={0}
							max={10}
							{...form.getInputProps("interest")}
						/>
					</SimpleGrid>

					<Textarea
						label="Comment"
						placeholder="Enter comment"
						minRows={3}
						{...form.getInputProps("last_comment")}
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
						<Button type="submit" c="blue">
							Save Changes
						</Button>
					</Group>
				</Stack>
			</form>
		</Paper>
	);
}
