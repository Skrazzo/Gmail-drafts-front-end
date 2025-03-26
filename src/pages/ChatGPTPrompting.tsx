import React, { useState, useEffect } from "react";
import {
    Container,
    Title,
    Card,
    Text,
    Tabs,
    Button,
    Textarea,
    Group,
    Loader,
    Badge,
    Paper,
    Stack,
    ActionIcon,
    ScrollArea,
    Divider,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { DatePickerInput } from "@mantine/dates";
import { IconRefresh, IconSend } from "@tabler/icons-react";
import { DateRange, PromptBatches } from "@/types/ChatGPT";
import Requests from "@/functions/Requests";

// Mock function to simulate sending a prompt (replace with actual API call later)
const mockSendPrompt = async (prompt: string, dateRange: DateRange | null): Promise<void> => {
    // This would be replaced with an actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
};

const ChatGPTPromptingPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string | null>("new");
    const [prompt, setPrompt] = useState("");
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [batches, setBatches] = useState<PromptBatches>();
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState<PromptBatches | null>(null);

    // Fetch batches on component mount
    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        Requests.get<PromptBatches>({
            url: "/ai/batches",
            success(data) {
                setBatches(data);
            },
            before() {
                setIsLoading(true);
            },
            finally() {
                setIsLoading(false);
            },
        });
    };

    const handleSubmit = async () => {
        if (!prompt.trim()) {
            notifications.show({
                title: "Error",
                message: "Please enter a prompt",
                color: "red",
            });
            return;
        }

        Requests.post({
            url: "/ai/batch",
            data: {
                from: dateRange[0],
                to: dateRange[1],
                prompt: prompt.trim(),
            },
            success(data) {
                notifications.show({
                    title: "Created",
                    message: "Prompt was successfully sent to openai for processing",
                    color: "green",
                });
            },
            before() {
                setIsSending(true);
            },
            finally() {
                setIsSending(false);
            },
        });
    };

    const handleBatchSelect = (batch: PromptBatch) => {
        setSelectedBatch(batch);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "running":
                return <Badge color="blue">Running</Badge>;
            case "completed":
                return <Badge color="green">Completed</Badge>;
            case "failed":
                return <Badge color="red">Failed</Badge>;
            default:
                return <Badge color="gray">Unknown</Badge>;
        }
    };

    return (
        <Container size="xl">
            <Title order={2} mb="lg">
                ChatGPT Email Analysis
            </Title>

            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List>
                    <Tabs.Tab value="new">New Prompt</Tabs.Tab>
                    <Tabs.Tab value="running">
                        Running ({batches.filter((b) => b.status === "running").length})
                    </Tabs.Tab>
                    <Tabs.Tab value="completed">
                        Completed ({batches.filter((b) => b.status === "completed").length})
                    </Tabs.Tab>
                    <Tabs.Tab value="failed">Failed ({batches.filter((b) => b.status === "failed").length})</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="new" p="md">
                    <Card withBorder shadow="sm" radius="md" p="lg">
                        <Title order={3} mb="md">
                            Ask ChatGPT About Your Emails
                        </Title>

                        <Text mb="xs">Select date range (optional):</Text>
                        <DatePickerInput
                            mb="md"
                            type="range"
                            value={dateRange}
                            onChange={(v) => setDateRange(v)}
                            placeholder={"Pick dates range"}
                            clearable
                        />

                        <Text mb="xs">Your prompt:</Text>
                        <Textarea
                            mb="md"
                            placeholder="E.g., 'Summarize the main topics discussed in these emails' or 'Find all emails related to project X'"
                            minRows={1}
                            value={prompt}
                            autosize
                            onChange={(e) => setPrompt(e.target.value)}
                        />

                        <Group>
                            <Button leftSection={<IconSend size={16} />} onClick={handleSubmit} loading={isSending}>
                                Send Prompt
                            </Button>
                        </Group>
                    </Card>
                </Tabs.Panel>

                <Tabs.Panel value="running" p="md">
                    <DisplayBatches
                        batches={batches.filter((b) => b.status === "running")}
                        isLoading={isLoading}
                        onBatchSelect={handleBatchSelect}
                        onRefresh={fetchBatches}
                        selectedBatch={selectedBatch}
                    />
                </Tabs.Panel>

                <Tabs.Panel value="completed" p="md">
                    <DisplayBatches
                        batches={batches.filter((b) => b.status === "completed")}
                        isLoading={isLoading}
                        onBatchSelect={handleBatchSelect}
                        onRefresh={fetchBatches}
                        selectedBatch={selectedBatch}
                    />
                </Tabs.Panel>

                <Tabs.Panel value="failed" p="md">
                    <DisplayBatches
                        batches={batches.filter((b) => b.status === "failed")}
                        isLoading={isLoading}
                        onBatchSelect={handleBatchSelect}
                        onRefresh={fetchBatches}
                        selectedBatch={selectedBatch}
                    />
                </Tabs.Panel>
            </Tabs>
        </Container>
    );
};

interface DisplayBatchesProps {
    batches: PromptBatch[];
    isLoading: boolean;
    onBatchSelect: (batch: PromptBatch) => void;
    onRefresh: () => void;
    selectedBatch: PromptBatch | null;
}

const DisplayBatches: React.FC<DisplayBatchesProps> = ({
    batches,
    isLoading,
    onBatchSelect,
    onRefresh,
    selectedBatch,
}) => {
    if (isLoading) {
        return (
            <Group justify="center" p="xl">
                <Loader />
            </Group>
        );
    }

    if (batches.length === 0) {
        return (
            <Card withBorder shadow="sm" radius="md" p="lg">
                <Text ta="center" c="dimmed">
                    No prompts found
                </Text>
            </Card>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "running":
                return <Badge color="blue">Running</Badge>;
            case "completed":
                return <Badge color="green">Completed</Badge>;
            case "failed":
                return <Badge color="red">Failed</Badge>;
            default:
                return <Badge color="gray">Unknown</Badge>;
        }
    };

    return (
        <Group grow align="flex-start">
            <Card withBorder shadow="sm" radius="md" p={0} style={{ height: "500px" }}>
                <Group p="xs" position="apart">
                    <Text fw={500}>Prompts</Text>
                    <ActionIcon onClick={onRefresh} variant="subtle">
                        <IconRefresh size={16} />
                    </ActionIcon>
                </Group>
                <Divider />
                <ScrollArea style={{ height: "450px" }}>
                    <Stack spacing="xs" p="xs">
                        {batches.map((batch) => (
                            <Paper
                                key={batch.id}
                                withBorder
                                p="sm"
                                onClick={() => onBatchSelect(batch)}
                                style={{
                                    cursor: "pointer",
                                    backgroundColor:
                                        selectedBatch?.id === batch.id ? "var(--mantine-color-blue-light)" : undefined,
                                }}
                            >
                                <Group position="apart" mb="xs">
                                    <Text size="sm" fw={500} lineClamp={1}>
                                        {batch.prompt}
                                    </Text>
                                    {getStatusBadge(batch.status)}
                                </Group>
                                <Text size="xs" c="dimmed">
                                    Created: {formatDate(batch.createdAt)}
                                </Text>
                                <Text size="xs" c="dimmed">
                                    Date Range:{" "}
                                    {batch.dateRange.from ? new Date(batch.dateRange.from).toLocaleDateString() : "All"}
                                    {batch.dateRange.to
                                        ? ` to ${new Date(batch.dateRange.to).toLocaleDateString()}`
                                        : ""}
                                </Text>
                            </Paper>
                        ))}
                    </Stack>
                </ScrollArea>
            </Card>

            <Card withBorder shadow="sm" radius="md" p="md" style={{ height: "500px" }}>
                {selectedBatch ? (
                    <ScrollArea style={{ height: "100%" }}>
                        <Title order={4} mb="xs">
                            {selectedBatch.prompt}
                        </Title>
                        <Group mb="md">
                            {getStatusBadge(selectedBatch.status)}
                            <Text size="sm">Created: {formatDate(selectedBatch.createdAt)}</Text>
                            {selectedBatch.completedAt && (
                                <Text size="sm">Completed: {formatDate(selectedBatch.completedAt)}</Text>
                            )}
                        </Group>
                        <Text size="sm" mb="md">
                            Date Range:{" "}
                            {selectedBatch.dateRange.from
                                ? new Date(selectedBatch.dateRange.from).toLocaleDateString()
                                : "All emails"}
                            {selectedBatch.dateRange.to
                                ? ` to ${new Date(selectedBatch.dateRange.to).toLocaleDateString()}`
                                : ""}
                        </Text>
                        <Divider my="md" />
                        {selectedBatch.status === "running" ? (
                            <Group justify="center" p="xl">
                                <Loader />
                                <Text>Processing prompt...</Text>
                            </Group>
                        ) : selectedBatch.status === "failed" ? (
                            <Text c="red">Failed to process this prompt. Please try again.</Text>
                        ) : (
                            <Text>{selectedBatch.result || "No result available"}</Text>
                        )}
                    </ScrollArea>
                ) : (
                    <Text c="dimmed" ta="center" mt="xl">
                        Select a prompt to view details
                    </Text>
                )}
            </Card>
        </Group>
    );
};

export default ChatGPTPromptingPage;
