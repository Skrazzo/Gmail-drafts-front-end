import { ModalForm } from "@/components/ui/ModalForm";
import { CompanyExists, ListCompanies } from "@/types";
import { Button, ComboboxData, Paper, Select, SimpleGrid, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLink, IconPencil, IconPlus } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";

interface CompanyForm {
	name: string;
	type: string;
}

interface LinkCompanyForm {
	company_id: number | string;
}

interface EmailCompanyProps {
	email_id: number;
	company_id: number;
	company_name: string;
	company_type: string;
	onUpdate: () => void;
}

export default function EditCompany({ onUpdate, email_id, company_id, company_name, company_type }: EmailCompanyProps) {
	const [loading, setLoading] = useState<boolean>(false);

	//#region edit company
	const [editModal, setEM] = useState<boolean>(false);
	const editForm = useForm<CompanyForm>({
		mode: "uncontrolled",
		initialValues: {
			name: company_name,
			type: company_type,
		},

		validate: {
			name: (e) => e.length < 4 ? "Name is too short" : null,
			type: (e) => e.length < 4 ? "Type is too short" : null,
		},
	});

	const editHandler = async () => {
		if (!editForm.isValid()) {
			editForm.validate();
			return;
		}

		// all values to lowercase
		let values = editForm.getValues() as CompanyForm;
		values.name = values.name.toLowerCase();
		values.type = values.type.toLowerCase();

		// set loading
		setLoading(true);

		// Send request to edit company
		const res = await axios.put("/company/edit", null, { params: { ...values, company_id } });
		if (!res.data.success) {
			alert("There was an error while editing company");
			console.error(res.data.error);
		} else {
			onUpdate();
		}

		setLoading(false);
	};
	//#endregion
	//#region Create company
	const [createModal, setCM] = useState<boolean>(false);
	const createForm = useForm<CompanyForm>({
		mode: "uncontrolled",
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
	//#endregion
	//#region Link another company
	const [linkModal, setLM] = useState<boolean>(false);
	const [companies, setCompanies] = useState<null | ListCompanies["data"]>(null);
	const linkForm = useForm<LinkCompanyForm>({
		mode: "uncontrolled",
		initialValues: {
			company_id: company_id,
		},
		validate: {
			company_id: (e) => (!e || e === "" || e === "0") ? "Company is invalid" : null,
		},
	});

	const linkHandler = async () => {
		if (!linkForm.isValid()) {
			linkForm.validate();
			return;
		}

		// set loading
		setLoading(true);

		// Send request to link company
		const res = await axios.put("/company/link", null, { params: { ...linkForm.getValues(), email_id } });
		if (!res.data.success) {
			alert("There was an error while linking company");
			console.error(res.data.error);
		} else {
			onUpdate();
		}

		setLoading(false);
	};

	useEffect(() => {
		// Load all companies
		axios.get<ListCompanies>("/companies/list").then((res) => {
			if (!res.data.success) {
				console.error(res.data.error);
			} else {
				setCompanies(res.data.data);
			}
		});
	}, []);

	//#endregion
	return (
		<Paper withBorder p={"md"} mb={16}>
			<ModalForm
				title="Edit company"
				onConfirm={editHandler}
				onClose={() => setEM(false)}
				opened={editModal}
				loading={loading}
			>
				<Stack gap={"xs"}>
					<TextInput
						placeholder="Company name"
						key={editForm.key("name")}
						{...editForm.getInputProps("name")}
					/>
					<TextInput
						placeholder="Company type"
						key={editForm.key("type")}
						{...editForm.getInputProps("type")}
					/>
				</Stack>
			</ModalForm>

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

			<ModalForm
				title="Link to another company"
				onConfirm={linkHandler}
				onClose={() => setLM(false)}
				opened={linkModal}
				loading={loading}
			>
				{!companies ? <p>Loading companies...</p> : (
					<Select
						label="Search and select company"
						placeholder="Pick a company"
						data={companies.map((c) => ({ value: c.id.toString(), label: c.name }))}
						searchable
						{...linkForm.getInputProps("company_id")}
					/>
				)}
			</ModalForm>

			<Text fw={700}>Edit Company</Text>
			<SimpleGrid cols={3} mt={8}>
				<Button onClick={() => setCM(true)} variant="light" leftSection={<IconPlus />}>Create company</Button>
				<Button onClick={() => setEM(true)} variant="light" leftSection={<IconPencil />}>
					Edit company name
				</Button>
				<Button onClick={() => setLM(true)} variant="light" leftSection={<IconLink />}>
					Link to another company
				</Button>
			</SimpleGrid>
		</Paper>
	);
}
