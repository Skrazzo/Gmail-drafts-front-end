import Requests from "@/functions/Requests";
import { ActionIcon, Button, Flex, Group, Modal, Stack, TextInput } from "@mantine/core";
import { IconEditCircle, IconTrash } from "@tabler/icons-react";
import { useState } from "react";

interface Props {
    socialMedia: Record<string, string> | null;
    companyId: number;
}

interface SocialMediaEntry {
    key: string;
    value: string;
}

export default function EditSocialMedia(props: Props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [entries, setEntries] = useState<SocialMediaEntry[]>(() => {
        if (!props.socialMedia) return [];
        return Object.entries(props.socialMedia).map(([key, value]) => ({ key, value }));
    });

    const addNewEntry = () => {
        setEntries([...entries, { key: "", value: "" }]);
    };

    const removeEntry = (index: number) => {
        setEntries(entries.filter((_, i) => i !== index));
    };

    const updateEntry = (index: number, field: keyof SocialMediaEntry, value: string) => {
        const newEntries = [...entries];
        newEntries[index] = { ...newEntries[index], [field]: value };
        setEntries(newEntries);
    };

    const saveSocialMedia = () => {
        const validSocialMedia = entries.filter(({ key, value }) => key !== "" && value !== "");
        const databaseObject = validSocialMedia.reduce(
            (acc, { key, value }) => ({
                ...acc,
                [key]: value,
            }),
            {}
        );

        Requests.post({
            url: "/company/socialMedia",
            data: {
                company_id: props.companyId,
                social_media: JSON.stringify(databaseObject),
            },
            before: () => setLoading(true),
            success(data) {
                console.log(data);
                setLoading(false);
                // Refresh page
                window.location.reload();
            },
        });
    };

    return (
        <>
            <ActionIcon variant="subtle" onClick={() => setOpen(true)}>
                <IconEditCircle size={20} />
            </ActionIcon>

            <Modal opened={open} onClose={() => setOpen(false)} title="Social media">
                <Stack gap={8}>
                    {entries.map((entry, index) => (
                        <Flex key={index} align={"center"} gap={8}>
                            <TextInput
                                placeholder="Platform name"
                                value={entry.key}
                                onChange={(e) => updateEntry(index, "key", e.target.value)}
                            />
                            <TextInput
                                flex={1}
                                placeholder="Username or URL"
                                value={entry.value}
                                onChange={(e) => updateEntry(index, "value", e.target.value)}
                                w={"100%"}
                            />
                            <ActionIcon
                                maw={"fit-content"}
                                variant="subtle"
                                color="red"
                                onClick={() => removeEntry(index)}
                            >
                                <IconTrash size={20} />
                            </ActionIcon>
                        </Flex>
                    ))}
                    <Group grow mt={8}>
                        <Button loading={loading} onClick={addNewEntry} variant="light">
                            Add Platform
                        </Button>
                        <Button loading={loading} onClick={saveSocialMedia}>
                            Save
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
}
