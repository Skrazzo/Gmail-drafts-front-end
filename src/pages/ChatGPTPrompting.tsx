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
    Skeleton,
    ThemeIcon,
    CloseButton,
    Flex,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar, IconRefresh, IconSend } from "@tabler/icons-react";
import { PromptBatches, Batch, BatchData, EmailInfo } from "@/types/ChatGPT";
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
    const [selectedEmail, setSelectedEmail] = useState<EmailInfo | null>(null);

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
            success(_data) {
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

        // Reset selected email if a new batch is selected
        if (selectedBatch?.id !== batch.id) {
            setSelectedEmail(null);
        }

        setSelectedBatch(batch);

        Requests.get<BatchData>({
            url: "/ai/batch",
            params: { batch_id: batch.id },
            before() {
                setSelectedBatchData(null);
            },
            success(data) {
                setSelectedBatchData(data);
            },
        });
    };

    const handleEmailSelect = (email: EmailInfo) => {
        setSelectedEmail((prev) => (prev?.id === email.id ? null : email));
    };

    const getBatchCount = (type: keyof PromptBatches) => {
        return batches[type]?.length || 0;
    };

    // Format date in a more user-friendly way
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
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
                        selectedBatchData={selectedBatchData}
                        selectedEmail={selectedEmail}
                        onEmailSelect={handleEmailSelect}
                        formatDate={formatDate}
                    />
                </Tabs.Panel>

                <Tabs.Panel value="completed" p="md">
                    <DisplayBatches
                        batches={batches.completed}
                        isLoading={isLoading}
                        onBatchSelect={handleBatchSelect}
                        onRefresh={fetchBatches}
                        selectedBatch={selectedBatch}
                        selectedBatchData={selectedBatchData}
                        selectedEmail={selectedEmail}
                        onEmailSelect={handleEmailSelect}
                        formatDate={formatDate}
                    />
                </Tabs.Panel>

                <Tabs.Panel value="failed" p="md">
                    <DisplayBatches
                        batches={batches.failed}
                        isLoading={isLoading}
                        onBatchSelect={handleBatchSelect}
                        onRefresh={fetchBatches}
                        selectedBatch={selectedBatch}
                        selectedBatchData={selectedBatchData}
                        selectedEmail={selectedEmail}
                        onEmailSelect={handleEmailSelect}
                        formatDate={formatDate}
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
    selectedBatchData: BatchData | null;
    selectedEmail: EmailInfo | null;
    onEmailSelect: (email: EmailInfo) => void;
    formatDate: (dateString: string) => string;
}

const DisplayBatches: React.FC<DisplayBatchesProps> = ({
    batches,
    isLoading,
    onBatchSelect,
    onRefresh,
    selectedBatch,
    selectedBatchData,
    selectedEmail,
    onEmailSelect,
    formatDate,
}) => {
    if (isLoading) {
        return (
            <Group justify="center" p="xl">
                <Loader />
            </Group>
        );
    }

    console.log(selectedBatchData);

    if (batches.length === 0) {
        return (
            <Card withBorder shadow="sm" radius="md" p="lg">
                <Text ta="center" c="dimmed">
                    No prompts found
                </Text>
            </Card>
        );
    }

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
                from: range[0] ? range[0] : null,
                to: range[1] ? range[1] : null,
            };
        } catch (e) {
            return { from: null, to: null };
        }
    };

    // Get first couple of lines from ChatGPT response
    const getPreviewResponse = (chatGptResponse: string) => {
        if (!chatGptResponse) return "No response available";

        // Split by newlines, get first two lines, and join with newline
        const lines = chatGptResponse.split("\n");
        return lines.slice(0, 2).join("\n") + (lines.length > 2 ? "..." : "");
    };

    // Extract date range in a consistent format

    const getFormattedDateRange = (dateRangeString: string) => {
        try {
            const { from, to } = parseDateRange(dateRangeString);
            return (
                <>
                    {from ? formatDate(from) : "All emails"}
                    {to ? ` to ${formatDate(to)}` : ""}
                </>
            );
        } catch (e) {
            return "Date range not available";
        }
    };

    // Function to handle batch click and open batch details
    const handleBatchClick = (batch: Batch) => {
        onBatchSelect(batch);
    };

    return (
        <Stack gap="md">
            <Group grow align="flex-start">
                {/* Left panel - Batch list */}
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
                            {batches.map((batch) => (
                                <Paper
                                    key={batch.id}
                                    withBorder
                                    p="sm"
                                    onClick={() => handleBatchClick(batch)}
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor:
                                            selectedBatch?.id === batch.id
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
                                    <Group gap="xs" align="center">
                                        <ThemeIcon size="xs" color="gray" variant="light">
                                            <IconCalendar size={10} />
                                        </ThemeIcon>
                                        <Text size="xs" c="dimmed">
                                            {getFormattedDateRange(batch.db.date_range)}
                                        </Text>
                                    </Group>
                                </Paper>
                            ))}
                        </Stack>
                    </ScrollArea>
                </Card>

                {/* Right panel - Batch details */}
                <Card withBorder shadow="sm" radius="md" p="md" style={{ height: "500px" }}>
                    {!selectedBatch ? (
                        <Text c="dimmed" ta="center" mt="xl">
                            Select a prompt to view details
                        </Text>
                    ) : selectedBatchData === null ? (
                        <Stack>
                            <Skeleton height={30} width="70%" mb="sm" />
                            <Group mb="md">
                                <Skeleton height={20} width={60} />
                                <Skeleton height={20} width={140} />
                            </Group>
                            <Skeleton height={20} width="60%" mb="md" />
                            <Divider my="md" />
                            <Skeleton height={50} mb="sm" />
                            <Skeleton height={50} mb="sm" />
                            <Skeleton height={50} mb="sm" />
                        </Stack>
                    ) : (
                        <ScrollArea style={{ height: "100%" }}>
                            <Title order={4} mb="xs">
                                {selectedBatchData?.prompt || selectedBatch.db.prompt}
                            </Title>
                            <Group mb="md">
                                {getStatusBadge(selectedBatch.status)}
                                <Text size="sm">Created: {formatDate(selectedBatch.db.created_at)}</Text>
                            </Group>
                            <Group gap="xs" align="center" mb="md">
                                <ThemeIcon size="sm" color="blue" variant="light">
                                    <IconCalendar size={14} />
                                </ThemeIcon>
                                <Text size="sm">
                                    {selectedBatchData?.date_range
                                        ? `${formatDate(selectedBatchData.date_range[0])} to ${formatDate(selectedBatchData.date_range[1])}`
                                        : getFormattedDateRange(selectedBatch.db.date_range)}
                                </Text>
                            </Group>
                            <Divider my="md" />

                            {selectedBatch.status === "in_progress" ? (
                                <Group justify="center" p="xl">
                                    <Loader />
                                    <Text>Processing prompt...</Text>
                                </Group>
                            ) : selectedBatch.status === "failed" ? (
                                <Text c="red">Failed to process this prompt. Please try again.</Text>
                            ) : !Object.keys(selectedBatchData?.emails || {}).length ? (
                                <Text>No emails processed for this prompt.</Text>
                            ) : (
                                <Stack gap="xs">
                                    {/* Count total emails across all records */}

                                    {/* Iterate through each email record */}
                                    {Object.entries(selectedBatchData.emails).map(
                                        ([email, emailRecord]: [string, EmailInfo[]], _idx) => (
                                            <div key={email}>
                                                {/* Display the email address as a section title */}
                                                <Text size="sm" fw={600}>
                                                    {email}
                                                </Text>

                                                {/* Display each email in this thread */}
                                                {emailRecord.map((email) => (
                                                    <Paper
                                                        key={email.id}
                                                        withBorder
                                                        p="sm"
                                                        mt="xs"
                                                        onClick={() => onEmailSelect(email)}
                                                        style={{
                                                            cursor: "pointer",
                                                            backgroundColor:
                                                                selectedEmail?.id === email.id
                                                                    ? "var(--mantine-color-blue-light)"
                                                                    : undefined,
                                                        }}
                                                    >
                                                        <Group justify="space-between" mb="xs">
                                                            <Text size="sm" fw={500} lineClamp={2}>
                                                                {email.subject || "(No subject)"}
                                                            </Text>
                                                            <Badge size="sm">{email.type}</Badge>
                                                        </Group>
                                                        <Text size="xs" c="dimmed" mb="xs">
                                                            Date: {formatDate(email.email_date)}
                                                        </Text>
                                                        <Text size="xs" lineClamp={4}>
                                                            {getPreviewResponse(email.chat_gpt)}
                                                        </Text>
                                                    </Paper>
                                                ))}
                                            </div>
                                        )
                                    )}
                                </Stack>
                            )}
                        </ScrollArea>
                    )}
                </Card>
            </Group>

            {/* Email detail section that shows when an email is selected */}
            {selectedEmail && (
                <Card withBorder shadow="sm" radius="md" p="md">
                    <Flex align={"center"} justify={"space-between"} w={"100%"} mb="md">
                        <Title order={4}>Email Details</Title>
                        <CloseButton onClick={() => onEmailSelect(selectedEmail)} />
                    </Flex>

                    <Flex direction={"column"} mb="md">
                        <Text fw={700} size="lg">
                            {selectedEmail.subject || "(No subject)"}
                        </Text>
                        <Text size="sm" c="dimmed">
                            Type: {selectedEmail.type} • Date: {formatDate(selectedEmail.email_date)}
                        </Text>
                    </Flex>

                    <Divider my="md" label="Email Content" labelPosition="center" />

                    <Paper p="md" withBorder mb="md">
                        <ScrollArea style={{ maxHeight: "300px" }}>
                            <div style={{ whiteSpace: "pre-wrap" }}>
                                {selectedEmail.body || "No email content available"}
                            </div>
                        </ScrollArea>
                    </Paper>

                    <Divider my="md" label="ChatGPT Analysis" labelPosition="center" />

                    <Paper p="md" withBorder>
                        <ScrollArea style={{ maxHeight: "300px" }}>
                            <div style={{ whiteSpace: "pre-wrap" }}>
                                {selectedEmail.chat_gpt || "No analysis available"}
                            </div>
                        </ScrollArea>
                    </Paper>
                </Card>
            )}
        </Stack>
    );
};

export default ChatGPTPromptingPage;
