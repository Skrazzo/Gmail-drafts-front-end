import { useEffect, useState } from "react";
import { Badge, Box, Button, Card, Checkbox, Flex, Group, Loader, Paper, Text, Textarea, Title } from "@mantine/core";
import Requests from "@/functions/Requests";
import axios from "axios";
import { Info } from "@/types/AmazonScraper";
import { notifications } from "@mantine/notifications";
import { IconDownload, IconTrash } from "@tabler/icons-react";
import { AMAZON_API_KEY, AMAZON_API_URL } from "@/global";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Enable relative time plugin for dayjs
dayjs.extend(relativeTime);

export default function AmazonScraper() {
    const [info, setInfo] = useState<Info | null>(null);
    const [loading, setLoading] = useState(true);
    const [links, setLinks] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

    // Fetch info data from API
    const fetchInfo = async () => {
        Requests.get<Info>({
            url: AMAZON_API_URL + "/info",
            headers: { "api-key": AMAZON_API_KEY },
            before() {
                setLoading(true);
            },
            success(data) {
                setInfo(data);
            },
            finally() {
                setLoading(false);
            },
        });
    };

    useEffect(() => {
        fetchInfo();
        // Set up interval to refresh info every 10 seconds
        const interval = setInterval(fetchInfo, 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Handle sending links for crawling
    const handleSendForCrawling = () => {
        if (!links.trim()) {
            notifications.show({
                title: "Error",
                message: "Please enter at least one link",
                color: "red",
            });
            return;
        }

        const linksArray = links.split("\n").filter((link) => link.trim());

        // Send links to the API for crawling
        Requests.post<any>({
            url: AMAZON_API_URL + "/start",
            data: {
                books: linksArray,
            },
            headers: {
                "api-key": AMAZON_API_KEY,
            },
            before() {
                setLoading(true);
            },
            success() {
                notifications.show({
                    title: "Links sent",
                    message: `Sent ${linksArray.length} links for crawling`,
                    color: "green",
                });

                // Clear the textarea after sending
                setLinks("");

                // Refresh info to get updated crawler status
                fetchInfo();
            },
            finally() {
                setLoading(false);
            },
        });
    };

    // File selection handling
    const toggleFileSelection = (filePath: string) => {
        setSelectedFiles((prev) =>
            prev.includes(filePath) ? prev.filter((f) => f !== filePath) : [...prev, filePath]
        );
    };

    // Group files by directory
    const createFileTree = (files: string[]) => {
        const fileTree: Record<string, string[]> = {};

        files.forEach((file) => {
            const parts = file.split("/");
            const isInFolder = parts.length > 1;

            if (isInFolder) {
                const folder = parts.slice(0, -1).join("/");
                if (!fileTree[folder]) {
                    fileTree[folder] = [];
                }
                fileTree[folder].push(file);
            } else {
                if (!fileTree["root"]) {
                    fileTree["root"] = [];
                }
                fileTree["root"].push(file);
            }
        });

        return fileTree;
    };

    // Handle folder selection (check/uncheck all files in folder)
    const handleFolderSelect = (_folder: string, files: string[], isSelected: boolean) => {
        if (isSelected) {
            // Remove all files in this folder
            setSelectedFiles((prev) => prev.filter((f) => !files.includes(f)));
        } else {
            // Add all files in this folder
            setSelectedFiles((prev) => [...prev, ...files.filter((f) => !prev.includes(f))]);
        }
    };

    // Check if all files in a folder are selected
    const isFolderSelected = (files: string[]) => {
        return files.every((file) => selectedFiles.includes(file));
    };

    // Check if some but not all files in a folder are selected
    const isFolderIndeterminate = (files: string[]) => {
        const selectedCount = files.filter((file) => selectedFiles.includes(file)).length;
        return selectedCount > 0 && selectedCount < files.length;
    };

    // Handle download action
    const handleDownload = (deleteAfter = false) => {
        if (selectedFiles.length === 0) {
            notifications.show({
                title: "No files selected",
                message: "Please select at least one file to download",
                color: "red",
            });
            return;
        }

        // Prepare request data
        const requestData: Record<string, any> = {
            files: selectedFiles,
        };

        // Add delete flag if needed
        if (deleteAfter) {
            requestData.delete = true;
        }

        notifications.show({
            title: "Download initiated",
            message: `Downloading ${selectedFiles.length} files${deleteAfter ? " and deleting them after" : ""}`,
            color: "blue",
        });

        // Send download request
        axios
            .post(AMAZON_API_URL + "/download", requestData, {
                headers: {
                    "api-key": AMAZON_API_KEY,
                },
                responseType: "blob", // Important for receiving binary file data
            })
            .then((response) => {
                // Create a blob URL and trigger download
                const blob = new Blob([response.data]);
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;

                // Use content-disposition header if available, otherwise use timestamp
                const filename = response.headers["content-disposition"]
                    ? response.headers["content-disposition"].split("filename=")[1].replace(/"/g, "")
                    : `unknown-${dayjs().format("YYYY-MM-DD HH:mm:ss")}`;

                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);

                if (deleteAfter) {
                    // Refresh info to reflect the deleted files
                    fetchInfo();
                }
            })
            .catch((error) => {
                console.error("Download error:", error);
                notifications.show({
                    title: "Download failed",
                    message: error.message || "Failed to download files",
                    color: "red",
                });
            });
    };

    return (
        <>
            <Title mb={16}>Amazon Scraper</Title>

            {/* Crawler Status Widget */}
            <Card mb={20} withBorder>
                <Group justify="apart">
                    <Text fw={500}>Crawler Status</Text>
                    <Badge color={info?.crawler.running ? "green" : "gray"}>
                        {info?.crawler.running ? "Running" : "Idle"}
                    </Badge>
                </Group>

                {loading ? (
                    <Flex align="center" gap={10} mt={10}>
                        <Loader size="sm" />
                        <Text size="sm">Loading crawler information...</Text>
                    </Flex>
                ) : (
                    <>
                        <Text size="sm" mt={10}>
                            <strong>Current Job:</strong> {info?.crawler.job || "No active job"}
                        </Text>
                        {info?.crawler.started_at && (
                            <Text size="sm" mt={5}>
                                <strong>Started at:</strong> {new Date(info.crawler.started_at).toLocaleString()}(
                                {dayjs(info.crawler.started_at).fromNow()})
                            </Text>
                        )}
                    </>
                )}
            </Card>

            {/* Links Input Area */}
            <Paper withBorder p="md" mb={20}>
                <Title order={3} mb={10}>
                    Submit Links for Crawling
                </Title>
                <Textarea
                    placeholder="Enter Amazon links (one per line)"
                    value={links}
                    onChange={(e) => setLinks(e.currentTarget.value)}
                    minRows={5}
                    autosize
                    maxRows={10}
                    mb={10}
                />
                <Button onClick={handleSendForCrawling} disabled={info?.crawler.running || loading}>
                    Send for Crawling
                </Button>
            </Paper>

            {/* Files Selection Area */}
            <Paper withBorder p="md">
                <Title order={3} mb={10}>
                    Available Files
                </Title>

                {loading ? (
                    <Flex align="center" gap={10}>
                        <Loader size="sm" />
                        <Text>Loading files...</Text>
                    </Flex>
                ) : info?.filesAvailable && info.filesAvailable.length > 0 ? (
                    <>
                        <Box mb={20}>
                            {Object.entries(createFileTree(info.filesAvailable)).map(([folder, files]) => (
                                <Box key={folder} mb={10}>
                                    {folder !== "root" && (
                                        <Checkbox
                                            label={<Text fw={500}>{folder}/</Text>}
                                            checked={isFolderSelected(files)}
                                            indeterminate={isFolderIndeterminate(files)}
                                            onChange={(_e) =>
                                                handleFolderSelect(folder, files, isFolderSelected(files))
                                            }
                                            mb={5}
                                        />
                                    )}
                                    <Box ml={folder !== "root" ? 25 : 0}>
                                        {files.map((file) => (
                                            <Checkbox
                                                key={file}
                                                label={folder === "root" ? file : file.split("/").pop()}
                                                checked={selectedFiles.includes(file)}
                                                onChange={() => toggleFileSelection(file)}
                                                mb={5}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        <Group>
                            <Button
                                leftSection={<IconDownload size={18} />}
                                onClick={() => handleDownload(false)}
                                disabled={selectedFiles.length === 0}
                            >
                                Download
                            </Button>
                            <Button
                                leftSection={<IconTrash size={18} />}
                                color="red"
                                onClick={() => handleDownload(true)}
                                disabled={selectedFiles.length === 0 || info?.crawler.running}
                            >
                                Download and Delete
                            </Button>
                        </Group>
                    </>
                ) : (
                    <Text>No files available</Text>
                )}
            </Paper>
        </>
    );
}
