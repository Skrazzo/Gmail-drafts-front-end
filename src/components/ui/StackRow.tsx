import { Flex, Stack, Text } from "@mantine/core";

interface Props {
    title: string;
    children: React.ReactNode;
}

export default function StackRow({ title, children }: Props) {
    return (
        <Stack gap={"xs"}>
            <Text size="sm">{title}</Text>
            <Flex align="center" gap={"md"}>
                {children}
            </Flex>
        </Stack>
    );
}
