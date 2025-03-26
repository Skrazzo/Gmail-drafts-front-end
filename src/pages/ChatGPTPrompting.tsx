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
import { DateRange, PromptBatches, Batch, BatchData } from "@/types/ChatGPT";
import Requests from "@/functions/Requests";

const ChatGPTPromptingPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string | null>("new");
    const [prompt, setPrompt] = useState("");
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [batches, setBatches] = useState<PromptBatches>({ completed: [], failed: [], in_progress: [] });

    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
    const [selectedBatchData, setSelectedBatchData] = useState<BatchData | null>(null);

    // Fetch batches on component mount
    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        Requests.get<PromptBatches>({
            url: "/ai/batches",
            success(data) {
                console.log(data);

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
                // Refresh batches after successful creation
                fetchBatches();
                // Reset form
                setPrompt("");
                setDateRange([null, null]);
            },
            before() {
                setIsSending(true);
            },
            finally() {
                setIsSending(false);
            },
        });
    };

    const handleBatchSelect = (batch: Batch) => {
        if (!batch) return;
        setSelectedBatch(batch);

        Requests.get<BatchData>({
            url: "/ai/batch",
            params: { batch_id: batch.id },

            before() {
                setSelectedBatchData(null);
            },
            success(data) {
                console.log(data);
                setSelectedBatchData(data);
            },
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "in_progress":
                return <Badge color="blue">Running</Badge>;
            case "completed":
                return <Badge color="green">Completed</Badge>;
            case "failed":
                return <Badge color="red">Failed</Badge>;
            default:
                return <Badge color="gray">Unknown</Badge>;
        }
    };

    const getBatchCount = (type: keyof PromptBatches) => {
        return batches[type]?.length || 0;
    };

    return (
        <Container size="xl">
            <Title order={2} mb="lg">
                ChatGPT Email Analysis
            </Title>

            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List>
                    <Tabs.Tab value="new">New Prompt</Tabs.Tab>
                    <Tabs.Tab value="in_progress">Running ({getBatchCount("in_progress")})</Tabs.Tab>
                    <Tabs.Tab value="completed">Completed ({getBatchCount("completed")})</Tabs.Tab>
                    <Tabs.Tab value="failed">Failed ({getBatchCount("failed")})</Tabs.Tab>
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

                <Tabs.Panel value="in_progress" p="md">
                    <DisplayBatches
                        batches={batches.in_progress}
                        isLoading={isLoading}
                        onBatchSelect={handleBatchSelect}
                        onRefresh={fetchBatches}
                        selectedBatch={selectedBatch}
                    />
                </Tabs.Panel>

                <Tabs.Panel value="completed" p="md">
                    <DisplayBatches
                        batches={batches.completed}
                        isLoading={isLoading}
                        onBatchSelect={handleBatchSelect}
                        onRefresh={fetchBatches}
                        selectedBatch={selectedBatch}
                    />
                </Tabs.Panel>

                <Tabs.Panel value="failed" p="md">
                    <DisplayBatches
                        batches={batches.failed}
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
    batches: Batch[];
    isLoading: boolean;
    onBatchSelect: (batch: Batch) => void;
    onRefresh: () => void;
    selectedBatch: Batch | null;
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
            case "in_progress":
                return <Badge color="blue">Running</Badge>;
            case "completed":
                return <Badge color="green">Completed</Badge>;
            case "failed":
                return <Badge color="red">Failed</Badge>;
            default:
                return <Badge color="gray">Unknown</Badge>;
        }
    };

    // Parse date range from JSON string
    const parseDateRange = (dateRangeStr: string) => {
        try {
            const range = JSON.parse(dateRangeStr);
            return {
                from: range.from ? new Date(range.from) : null,
                to: range.to ? new Date(range.to) : null,
            };
        } catch (e) {
            return { from: null, to: null };
        }
    };

    // Function to handle batch click and open batch details
    const handleBatchClick = (batch: Batch) => {
        onBatchSelect(batch);
        console.log(batch);
        // Here you would fetch the email list for this batch
        // This is where you would insert batch opening code
    };

    return (
        <Group grow align="flex-start">
            <Card withBorder shadow="sm" radius="md" p={0} style={{ height: "500px" }}>
                <Group p="xs" justify="apart">
                    <Text fw={500}>Prompts</Text>
                    <ActionIcon onClick={onRefresh} variant="subtle">
                        <IconRefresh size={16} />
                    </ActionIcon>
                </Group>
                <Divider />
                <ScrollArea style={{ height: "450px" }}>
                    <Stack gap={"xs"} p="xs">
                        {batches.map((batch) => {
                            const dateRange = parseDateRange(batch.db.date_range);
                            return (
                                <Paper
                                    key={batch.db.id}
                                    withBorder
                                    p="sm"
                                    onClick={() => handleBatchClick(batch)}
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor:
                                            selectedBatch?.db.id === batch.db.id
                                                ? "var(--mantine-color-blue-light)"
                                                : undefined,
                                    }}
                                >
                                    <Group justify="apart" mb="xs">
                                        <Text size="sm" fw={500} lineClamp={1}>
                                            {batch.db.prompt}
                                        </Text>
                                        {getStatusBadge(batch.status)}
                                    </Group>
                                    <Text size="xs" c="dimmed">
                                        Created: {formatDate(batch.db.created_at)}
                                    </Text>
                                    <Text size="xs" c="dimmed">
                                        Date Range: {dateRange.from ? dateRange.from.toLocaleDateString() : "All"}
                                        {dateRange.to ? ` to ${dateRange.to.toLocaleDateString()}` : ""}
                                    </Text>
                                </Paper>
                            );
                        })}
                    </Stack>
                </ScrollArea>
            </Card>

            <Card withBorder shadow="sm" radius="md" p="md" style={{ height: "500px" }}>
                {selectedBatch ? (
                    <ScrollArea style={{ height: "100%" }}>
                        <Title order={4} mb="xs">
                            {selectedBatch.db.prompt}
                        </Title>
                        <Group mb="md">
                            {getStatusBadge(selectedBatch.status)}
                            <Text size="sm">Created: {formatDate(selectedBatch.db.created_at)}</Text>
                        </Group>
                        <Text size="sm" mb="md">
                            {(() => {
                                const dateRange = parseDateRange(selectedBatch.db.date_range);
                                return (
                                    <>
                                        Date Range:{" "}
                                        {dateRange.from ? dateRange.from.toLocaleDateString() : "All emails"}
                                        {dateRange.to ? ` to ${dateRange.to.toLocaleDateString()}` : ""}
                                    </>
                                );
                            })()}
                        </Text>
                        <Divider my="md" />
                        {selectedBatch.status === "in_progress" ? (
                            <Group justify="center" p="xl">
                                <Loader />
                                <Text>Processing prompt...</Text>
                            </Group>
                        ) : selectedBatch.status === "failed" ? (
                            <Text c="red">Failed to process this prompt. Please try again.</Text>
                        ) : (
                            <Text>{selectedBatch.db.processed_info || "No result available"}</Text>
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
