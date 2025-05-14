import Requests from "@/functions/Requests";
import { AMAZON_API_KEY, AMAZON_API_URL } from "@/global";
import { openInNewTab } from "@/lib/utils";
import { Job } from "@/types/AmazonScraper";
import { Card, Group, Badge, Flex, Loader, Text, Button } from "@mantine/core";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface Props {
    name: string;
    info: Job | null;
    captcha?: {
        found: boolean | undefined;
        captchaUrl: string | null | undefined;
        deleteCaptchaUrl: string;
    };
}

export default function StatusWidget({ info, name, captcha }: Props) {
    const [deleted, setDeleted] = useState(false);

    function getPillColor() {
        let color = "gray";
        if (info?.running) color = "green";
        if (captcha?.found) color = "orange";

        return color;
    }

    function getPillText() {
        let text = "idle";
        if (info?.running) text = "running";
        if (captcha?.found) text = "paused";
        return text;
    }

    async function continueCrawling() {
        if (!captcha) return;

        Requests.delete({
            url: AMAZON_API_URL + captcha.deleteCaptchaUrl,
            headers: { "api-key": AMAZON_API_KEY },
            success() {
                setDeleted(true);
            },
        });
    }

    useEffect(() => {
        setDeleted(false);
    }, [captcha]);

    return (
        <Card mb={20} withBorder>
            <Group justify="apart">
                <Text fw={500}>{name} status</Text>
                {!info ? <Loader size="sm" /> : <Badge color={getPillColor()}>{getPillText()}</Badge>}
            </Group>

            {!info ? (
                <Flex align="center" gap={10} mt={10}>
                    <Loader size="sm" />
                    <Text size="sm">Loading crawler information...</Text>
                </Flex>
            ) : (
                <>
                    <Text size="sm" mt={10}>
                        <strong>Current Job:</strong>{" "}
                        {captcha?.found ? "Waiting for captcha to be solved" : info.job || "No active job"}
                    </Text>
                    {info.started_at && (
                        <Text size="sm" mt={5}>
                            <strong>Started at:</strong> {new Date(info.started_at).toLocaleString()}(
                            {dayjs(info.started_at).fromNow()})
                        </Text>
                    )}
                </>
            )}
            {captcha?.found && (
                <Group grow mt={16}>
                    <Button disabled={deleted} onClick={continueCrawling}>
                        Continue crawling
                    </Button>
                    {captcha.captchaUrl && captcha.captchaUrl !== null && captcha.captchaUrl !== "" && (
                        <Button disabled={deleted} variant="light" onClick={() => openInNewTab(captcha.captchaUrl)}>
                            Go to last crawler url
                        </Button>
                    )}
                </Group>
            )}
        </Card>
    );
}
