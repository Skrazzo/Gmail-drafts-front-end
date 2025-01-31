import { Code, Flex, Paper, Pill, SimpleGrid, TextInput } from "@mantine/core";
import type { ActionHistory } from "@/types/ActionsHistory";

interface SubCategoryDisplayProps {
    subCategory: ActionHistory["sub_category"];
    type: ActionHistory["type"];
}

export function SubCategoryDisplay({ subCategory, type }: SubCategoryDisplayProps) {
    if (!subCategory || !type) return null;

    const renderJsonGrid = (data: Record<string, string | null>) => (
        <SimpleGrid cols={2} spacing="md">
            {Object.entries(data).map(([key, value]) => (
                <TextInput
                    key={key}
                    label={key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    value={value || ""}
                    disabled
                    styles={{
                        input: { color: "black" },
                    }}
                />
            ))}
        </SimpleGrid>
    );

    const renderArrayFlex = (data: any[]) => {
        return (
            <Flex gap={8} wrap={"wrap"}>
                {data.map((item) => (
                    <Pill>{item.toString()}</Pill>
                ))}
            </Flex>
        );
    };

    return (
        <Paper p="md" my={8} withBorder>
            {(() => {
                switch (type) {
                    case "email_info_update":
                    case "company_created":
                    case "company_updated":
                        const data = JSON.parse(subCategory) as Record<string, string | null>;
                        return renderJsonGrid(data);
                    case "queue":
                        const queueData = JSON.parse(subCategory) as string[];
                        return renderArrayFlex(queueData);
                    default:
                        return <Code block>{subCategory}</Code>;
                }
            })()}
        </Paper>
    );
}
