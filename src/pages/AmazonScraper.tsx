import { useEffect, useState } from "react";
import { Badge, Box, Button, Card, Checkbox, Flex, Group, Loader, Paper, Text, Textarea, Title } from "@mantine/core";
import Requests from "@/functions/Requests";
import { Info } from "@/types/AmazonScraper";
import { notifications } from "@mantine/notifications";
import { IconDownload, IconTrash } from "@tabler/icons-react";
import { AMAZON_API_KEY, AMAZON_API_URL } from "@/global";

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

        // Here you would normally call your API
        console.log("Sending links for crawling:", linksArray);

        notifications.show({
            title: "Links sent",
            message: `Sent ${linksArray.length} links for crawling`,
            color: "green",
        });

        // Clear the textarea after sending
        setLinks("");
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
    const handleFolderSelect = (folder: string, files: string[], isSelected: boolean) => {
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

        console.log("Download files:", selectedFiles);
        console.log("Delete after download:", deleteAfter);

        // Here you would call your API to handle the download
        notifications.show({
            title: "Download initiated",
            message: `Downloading ${selectedFiles.length} files${deleteAfter ? " and deleting them after" : ""}`,
            color: "blue",
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
                                <strong>Started at:</strong> {new Date(info.crawler.started_at).toLocaleString()}
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
                <Button onClick={handleSendForCrawling}>Send for Crawling</Button>
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
                                            onChange={(e) => handleFolderSelect(folder, files, isFolderSelected(files))}
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
                                leftIcon={<IconDownload size={18} />}
                                onClick={() => handleDownload(false)}
                                disabled={selectedFiles.length === 0}
                            >
                                Download
                            </Button>
                            <Button
                                leftIcon={<IconTrash size={18} />}
                                color="red"
                                onClick={() => handleDownload(true)}
                                disabled={selectedFiles.length === 0}
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

