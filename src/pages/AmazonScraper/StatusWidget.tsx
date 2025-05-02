import { Job } from "@/types/AmazonScraper";
import { Card, Group, Badge, Flex, Loader, Text } from "@mantine/core";
import dayjs from "dayjs";

export default function StatusWidget({ info, name }: { name: string; info: Job | null }) {
    return (
        <Card mb={20} withBorder>
            <Group justify="apart">
                <Text fw={500}>{name} status</Text>
                {!info ? (
                    <Loader size="sm" />
                ) : (
                    <Badge color={info.running ? "green" : "gray"}>{info.running ? "Running" : "Idle"}</Badge>
                )}
            </Group>

            {!info ? (
                <Flex align="center" gap={10} mt={10}>
                    <Loader size="sm" />
                    <Text size="sm">Loading crawler information...</Text>
                </Flex>
            ) : (
                <>
                    <Text size="sm" mt={10}>
                        <strong>Current Job:</strong> {info.job || "No active job"}
                    </Text>
                    {info.started_at && (
                        <Text size="sm" mt={5}>
                            <strong>Started at:</strong> {new Date(info.started_at).toLocaleString()}(
                            {dayjs(info.started_at).fromNow()})
                        </Text>
                    )}
                </>
            )}
        </Card>
    );
}
