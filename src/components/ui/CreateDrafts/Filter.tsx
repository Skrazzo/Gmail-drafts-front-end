import requests from "@/functions/Requests";
import { AxiosResponse, DraftForm, Tag } from "@/types";
import { Button, Flex, Modal, MultiSelect, Paper, Pill, Text, Textarea } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconMail, IconTags } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

interface FilterProps {
    filteredEmails: string[];
    form: UseFormReturnType<DraftForm>;
}

export default function Filter(props: FilterProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [modalOpened, setModalOpened] = useState(false);
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const emailListRef = useRef<HTMLTextAreaElement | null>(null);

    // Fetch tags when component mounts
    const fetchTags = async () => {
        try {
            const res = (await axios.get<AxiosResponse<Tag[]>>("/tags/get")).data;
            if (res.success) {
                setTags(res.data);
            } else {
                throw new Error(res.error);
            }
        } catch (error) {
            console.error("Error fetching tags:", error);
            // You'll need to import notifications from @mantine/notifications
            notifications.show({
                title: "Error",
                message: error instanceof Error ? error.message : "Failed to fetch tags",
                color: "red",
            });
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const onFilterHandler = async (): Promise<void> => {
        if (!emailListRef.current) return;

        let value = emailListRef.current.value;
        if (value.trim() === "") return;

        // Check email with regex
        const emails: string[] = value.split("\n").filter((email) => {
            const tmp = email.trim();
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(tmp);
        });

        if (emails.length === 0) return;

        requests.post<string[]>({
            url: "/emails/filter",
            data: { emails },
            before: () => setLoading(true),
            success: (filtered) => {
                setLoading(false);
                props.form.setValues({ emails: filtered });
                if (emailListRef.current) emailListRef.current.value = "";
            },
        });
    };

    const onTagSelectHandler = async () => {
        setModalOpened(false);

        requests.post<string[]>({
            url: "/emails/filter",
            data: { tagIds: selectedTags },
            before: () => setLoading(true),
            success: (data) => {
                setLoading(false);
                props.form.setValues({ emails: data });
            },
        });
    };

    return (
        <>
            <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title="Select Tags" size="md">
                <MultiSelect
                    data={tags.map((tag) => ({ value: tag.id.toString(), label: tag.name }))}
                    value={selectedTags}
                    onChange={setSelectedTags}
                    placeholder="Select tags"
                    label="Tags"
                />
                <Flex justify="flex-end" mt="md">
                    <Button onClick={onTagSelectHandler}>Confirm</Button>
                </Flex>
            </Modal>

            <Paper withBorder p="md">
                <Text fw={700}>Select emails</Text>
                <Textarea
                    error={props.form.errors.emails}
                    mt={8}
                    ref={emailListRef}
                    placeholder="Paste emails from excel"
                    autosize
                    maxRows={10}
                />

                <Flex gap={8} mt={16} align={"center"}>
                    <Button onClick={onFilterHandler} loading={loading}>
                        Filter emails
                    </Button>
                    <Button variant="light" onClick={() => setModalOpened(true)} leftSection={<IconTags size={16} />}>
                        Select by tag
                    </Button>
                    <IconMail size={24} color="gray" strokeWidth={1} />
                    <Text size="lg" c="dimmed">
                        {props.filteredEmails.length}{" "}
                    </Text>
                </Flex>

                {props.filteredEmails.length > 0 ? (
                    <>
                        <Text fw={700} mt={16}>
                            Filtered emails
                        </Text>
                        <Flex gap={8} mt={8} wrap={"wrap"}>
                            {props.filteredEmails.map((e) => (
                                <Pill key={e}>{e}</Pill>
                            ))}
                        </Flex>
                    </>
                ) : (
                    <Text mt={16} fs={"italic"} c={"dimmed"}>
                        Filter some emails
                    </Text>
                )}
            </Paper>
        </>
    );
}
