import { Anchor, Flex, Group, Paper, Stack, Text } from "@mantine/core";
import EditSocialMedia from "./EditSocialMedia";

interface Props {
    socialMedia: string | null;
    companyId: number;
}

export default function CompanySocialMedia(props: Props) {
    let socialMedia: Record<string, string> = {};
    if (props.socialMedia !== null) {
        socialMedia = JSON.parse(props.socialMedia) as Record<string, string>;
    }

    return (
        <Paper p="sm">
            <Flex mt={16} gap={8} align={"center"}>
                <Text fw={700} size="md">
                    Social Media
                </Text>
                <EditSocialMedia socialMedia={socialMedia} companyId={props.companyId} />
            </Flex>
            <Flex wrap={"wrap"} gap={8} mt={8}>
                {Object.entries(socialMedia).map(([platform, value]) => (
                    <Flex gap={8}>
                        <Text c="dimmed">{platform}:</Text>
                        {value.startsWith("http") ? (
                            <Anchor href={value} target="_blank">
                                {value}
                            </Anchor>
                        ) : (
                            <Text>{value}</Text>
                        )}
                    </Flex>
                ))}
            </Flex>
        </Paper>
    );
}
