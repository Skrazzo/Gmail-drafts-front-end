import { ModalForm } from "@/components/ui/ModalForm";
import TagCombobox from "@/components/ui/Combobox/IdCombobox";
import getInputSourceClass from "@/functions/getInputSourceClass";
import { CompanyExists, CompanyForm, DecodedInputSource, EmailInfo, ListCompanies, Tag } from "@/types";
import {
    Anchor,
    Button,
    Center,
    Flex,
    Image,
    Paper,
    ScrollAreaAutosize,
    Select,
    SimpleGrid,
    Skeleton,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconLink, IconPencil, IconPlus } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import "../../index.css";
import IconVisitWebsite from "@/CustomIcons/IconVisitWebsite";
import { Table } from "@mantine/core";
import requests from "@/functions/Requests";
import { countriesSelectData } from "@/functions/countriesSelectData";
import { countries } from "countries-list";
import CompanySocialMedia from "./CompanySocialMedia";

interface LinkCompanyForm {
    company_id: number | string;
}

interface EmailCompanyProps {
    email_id: number;
    company_id: number;
    company_name: string;
    company_type: number[];
    company_tags: number[];
    company_input_source: string;
    company_logo: string | null;
    company_website: string;
    company_address: string | null;
    company_country: string | null;
    company_postal_code: string | null;
    company_social_media: string | null;
    onUpdate: () => void;
    navigateToEmail: (id: number) => void;
}

export default function EditCompany({
    onUpdate,
    email_id,
    company_id,
    company_name,
    company_tags,
    company_type,
    company_logo,
    company_website,
    company_address,
    company_input_source,
    company_country,
    company_postal_code,
    company_social_media,
    navigateToEmail,
}: EmailCompanyProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [allTypes, setAllTypes] = useState<Tag[]>([]);
    const inputSource = JSON.parse(company_input_source) as DecodedInputSource;
    const [linkedEmails, setLinkedEmails] = useState<EmailInfo[] | null>(null);

    let country = "";
    if (company_country) {
        const tmp = Object.entries(countries).find(([key, _item]) => key === company_country);
        if (tmp) {
            country = tmp[1].name;
        }
    }

    //#region edit company
    const [editModal, setEM] = useState<boolean>(false);
    const editForm = useForm<CompanyForm>({
        // mode: "uncontrolled",
        initialValues: {
            name: company_name,
            type: company_type,
            tags: company_tags,
            logo_url: company_logo,
            company_website: company_website,
            address: company_address,
            country: company_country,
            postal_code: company_postal_code,
        },

        validate: {
            name: (e) => (e.length < 4 ? "Name is too short" : null),
            type: (e) => (e.length < 1 ? "Type is too short" : null),
            logo_url: (e) =>
                e?.toString() === undefined || e === "" ? null : e.includes("https://") ? null : "Invalid URL",
            company_website: (e) => (e === "" ? null : e.includes("https://") ? null : "Invalid URL"),
        },
    });

    const editHandler = async () => {
        if (!editForm.isValid()) {
            editForm.validate();
            return;
        }

        // all values to lowercase
        let values = editForm.getValues() as CompanyForm;

        // set loading
        setLoading(true);

        // Send request to edit company
        const res = await axios.put("/company/edit", { ...values, company_id });
        if (!res.data.success) {
            notifications.show({
                withBorder: true,
                radius: "md",
                title: "Server error",
                color: "red",
                message: res.data.error.toString(),
            });
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
        initialValues: {
            name: "",
            type: [],
            tags: [],
            logo_url: null,
            company_website: "",
            address: null,
            postal_code: null,
            country: null,
        },

        validate: {
            name: (e) => (e.length < 4 ? "Name is too short" : null),
            type: (e) => (e.length < 1 ? "You need at least one type" : null),
            logo_url: (e) =>
                e?.toString() === undefined || e === "" ? null : e.includes("https://") ? null : "Invalid URL",
            company_website: (e) => (e === "" ? null : e.includes("https://") ? null : "Invalid URL"),
        },
    });

    const createHandler = async () => {
        if (!createForm.isValid()) {
            createForm.validate();
            return;
        }

        // all values to lowercase
        let values = createForm.getValues() as CompanyForm;

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
            setLoading(false);
            return;
        }

        // Send request to create company
        const res = await axios.post("/company/create", { ...values, email_id });
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
            company_id: (e) => (!e || e === "" || e === "0" ? "Company is invalid" : null),
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

    const fetchTags = async () => {
        requests.get<Tag[]>({
            url: "/tags/get",
            success(tags) {
                setAllTags(tags);
            },
        });
    };

    const fetchLinkedEmails = async () => {
        requests.get<EmailInfo[]>({
            url: "/company/emails/get",
            params: {
                id: company_id,
            },
            success: (d) => setLinkedEmails(d),
        });
    };

    const fetchTypes = async () => {
        requests.get<Tag[]>({
            url: "/types/get",
            success(data) {
                setAllTypes(data);
            },
        });
    };

    const getTagName = (data: Tag[], id: number): string => {
        const match = data.filter((tag) => tag.id === id);
        if (match.length > 0) {
            return match[0].name;
        } else {
            return "Icorrect id";
        }
    };

    useEffect(() => {
        fetchTags();
        fetchTypes();
        fetchLinkedEmails();
    }, []);

    return (
        <>
            <Center>{company_logo && <Image src={company_logo} h={120} radius={"md"} mb={16} />}</Center>
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
                            label={"Name"}
                            placeholder="New company name"
                            key={createForm.key("name")}
                            {...createForm.getInputProps("name")}
                        />

                        <TagCombobox
                            error={createForm.errors.type?.toString()}
                            label="Types"
                            form={createForm}
                            baseUrl="types"
                            formColumn="type"
                        />

                        <TextInput
                            label={"Company website"}
                            placeholder="Website url (https://...)"
                            key={createForm.key("company_website")}
                            {...createForm.getInputProps("company_website")}
                        />

                        <TextInput
                            label={"Link to logo"}
                            placeholder="Logo url"
                            key={createForm.key("logo_url")}
                            {...createForm.getInputProps("logo_url")}
                        />

                        <TextInput
                            label={"Address"}
                            placeholder="Company address"
                            key={createForm.key("address")}
                            {...createForm.getInputProps("address")}
                        />

                        <Select
                            label="Country"
                            placeholder="Select a country"
                            searchable
                            clearable
                            data={countriesSelectData()}
                            {...createForm.getInputProps("country")}
                        />

                        <TextInput
                            label={"Postal code"}
                            placeholder="Company postal code"
                            key={createForm.key("postal_code")}
                            {...createForm.getInputProps("postal_code")}
                        />

                        <TagCombobox form={createForm} baseUrl="tags" formColumn="tags" />
                    </Stack>
                </ModalForm>

                <ModalForm
                    title="Edit company"
                    onConfirm={editHandler}
                    onClose={() => setEM(false)}
                    opened={editModal}
                    loading={loading}
                >
                    <Stack gap={"xs"}>
                        <TextInput
                            label={"Name"}
                            placeholder="Company name"
                            key={editForm.key("name")}
                            {...editForm.getInputProps("name")}
                            className={getInputSourceClass(inputSource.name)}
                        />

                        <TagCombobox
                            error={editForm.errors.type?.toString()}
                            label="Types"
                            form={editForm}
                            baseUrl="types"
                            formColumn="type"
                            className={getInputSourceClass(inputSource.type_id, true)}
                        />

                        <TextInput
                            label={"Company website"}
                            placeholder="Website url (https://...)"
                            key={editForm.key("company_website")}
                            {...editForm.getInputProps("company_website")}
                            className={getInputSourceClass(inputSource.company_website)}
                        />
                        <TextInput
                            label={"Logo url"}
                            placeholder="Logo url (https://...)"
                            key={editForm.key("logo_url")}
                            {...editForm.getInputProps("logo_url")}
                            className={getInputSourceClass(inputSource.logo_url)}
                        />

                        <TextInput
                            label={"Address"}
                            placeholder="Company address"
                            key={editForm.key("address")}
                            {...editForm.getInputProps("address")}
                            className={getInputSourceClass(inputSource.address)}
                        />

                        <Select
                            label="Country"
                            placeholder="Select a country"
                            searchable
                            clearable
                            data={countriesSelectData()}
                            {...editForm.getInputProps("country")}
                            className={getInputSourceClass(inputSource.country)}
                        />

                        <TextInput
                            label={"Postal code"}
                            placeholder="Company postal code"
                            key={editForm.key("postal_code")}
                            {...editForm.getInputProps("postal_code")}
                            className={getInputSourceClass(inputSource.postal_code)}
                        />

                        <TagCombobox
                            form={editForm}
                            className={getInputSourceClass(inputSource.tags, true)}
                            baseUrl="tags"
                            formColumn="tags"
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
                    {!companies ? (
                        <p>Loading companies...</p>
                    ) : (
                        <Select
                            label="Search and select company"
                            placeholder="Pick a company"
                            data={companies.map((c) => ({ value: c.id.toString(), label: c.name }))}
                            searchable
                            {...linkForm.getInputProps("company_id")}
                        />
                    )}
                </ModalForm>

                <Flex align={"center"} gap={16}>
                    <Text fw={700}>Edit Company</Text>
                    {company_website && (
                        <Anchor
                            href={company_website.startsWith("http") ? company_website : `http://${company_website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Flex gap={8} align={"center"}>
                                <IconVisitWebsite />
                                <Text>Open website</Text>
                            </Flex>
                        </Anchor>
                    )}
                </Flex>

                <SimpleGrid cols={3} mt={8}>
                    <TextInput label="Company Name" value={company_name} disabled />
                    <TextInput
                        label="Company type"
                        value={company_type.map((id) => getTagName(allTypes, id)).join(", ")}
                        disabled
                    />
                    <TextInput
                        label={"Tags"}
                        placeholder="No tags"
                        value={company_tags.map((id) => getTagName(allTags, id)).join(", ")}
                        disabled
                    />
                    <TextInput label="Address" value={company_address || ""} disabled />
                    <TextInput label="Country" value={country} disabled />
                    <TextInput label="Postal code" value={company_postal_code || ""} disabled />
                </SimpleGrid>

                {!linkedEmails ? (
                    <Skeleton w={"100%"} h={150} mt={8} />
                ) : (
                    linkedEmails.length > 1 && (
                        <ScrollAreaAutosize mah={300} mt={16}>
                            <Table highlightOnHover>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Email</Table.Th>
                                        <Table.Th>Person Name</Table.Th>
                                        <Table.Th>Position</Table.Th>
                                        <Table.Th>Country</Table.Th>
                                        <Table.Th>Interest</Table.Th>
                                        <Table.Th>Primary</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {linkedEmails.map((email) => (
                                        <Table.Tr
                                            key={email.id}
                                            onClick={() => navigateToEmail(email.id)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <Table.Td>{email.email}</Table.Td>
                                            <Table.Td>{email.person_name || "-"}</Table.Td>
                                            <Table.Td>{email.person_position || "-"}</Table.Td>
                                            <Table.Td>{email.country || "-"}</Table.Td>
                                            <Table.Td>{email.interest || "-"}</Table.Td>
                                            <Table.Td>{email.primary ? "Yes" : "-"}</Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </ScrollAreaAutosize>
                    )
                )}

                <CompanySocialMedia socialMedia={company_social_media} companyId={company_id} />

                <SimpleGrid cols={3} mt={20}>
                    <Button onClick={() => setCM(true)} variant="light" leftSection={<IconPlus />}>
                        Create company
                    </Button>
                    <Button onClick={() => setEM(true)} variant="light" leftSection={<IconPencil />}>
                        Edit company name
                    </Button>
                    <Button onClick={() => setLM(true)} variant="light" leftSection={<IconLink />}>
                        Link to another company
                    </Button>
                </SimpleGrid>
            </Paper>
        </>
    );
}
