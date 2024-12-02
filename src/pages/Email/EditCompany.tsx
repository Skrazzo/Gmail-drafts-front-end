import { ModalForm } from "@/components/ui/ModalForm";
import { CompanyExists } from "@/types";
import { Button, Grid, Paper, SimpleGrid, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLink, IconPencil, IconPlus } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";

interface CompanyForm {
	name: string;
	type: string;
}

export default function EditCompany({ onUpdate, email_id }: { onUpdate: () => void; email_id: number }) {
	const [createModal, setCM] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const createForm = useForm<CompanyForm>({
		initialValues: {
			name: "",
			type: "",
		},

		validate: {
			name: (e) => e.length < 4 ? "Name is too short" : null,
			type: (e) => e.length < 4 ? "Type is too short" : null,
		},
	});

	const createHandler = async () => {
		if (!createForm.isValid()) {
			createForm.validate();
			return;
		}

		// all values to lowercase
		let values = createForm.getValues() as CompanyForm;
		values.name = values.name.toLowerCase();
		values.type = values.type.toLowerCase();

		// set loading
		setLoading(true);

		// Check if company exists or not
		const exists = await axios.get<CompanyExists>("/company/exists", { params: { company_name: values.name } });

		if (!exists.data.success) {
			alert("There was an error while checking if company exists");
			console.error(exists.data.error);
			return;
		}

		if (exists.data.data) {
			createForm.setErrors({ name: "Company already exists" });
			return;
		}

		// Send request to create company
		const res = await axios.post("/company/create", null, { params: { ...values, email_id } });
		if (!res.data.success) {
			console.error(res.data.error);
		} else {
			console.log(res.data.data);
			onUpdate();
		}

		setLoading(false);
	};

	return (
		<Paper withBorder p={"md"} mb={16}>
			<ModalForm
				title="Create new company"
				onConfirm={createHandler}
				onClose={() => setCM(false)}
				opened={createModal}
				loading={loading}
			>
				<Stack gap={"xs"}>
					<TextInput
						placeholder="New company name"
						key={createForm.key("name")}
						{...createForm.getInputProps("name")}
					/>
					<TextInput
						placeholder="Company type"
						key={createForm.key("type")}
						{...createForm.getInputProps("type")}
					/>
				</Stack>
			</ModalForm>

			<Text fw={700}>Edit Company</Text>
			<SimpleGrid cols={3} mt={8}>
				<Button onClick={() => setCM(true)} variant="light" leftSection={<IconPlus />}>Create company</Button>
				<Button onClick={() => {}} variant="light" leftSection={<IconPencil />}>Edit company name</Button>
				<Button onClick={() => {}} variant="light" leftSection={<IconLink />}>Link to another company</Button>
			</SimpleGrid>
		</Paper>
	);
}
