import { AxiosResponse, DraftForm } from "@/types";
import { Button, Flex, Paper, Pill, Text, Textarea } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconMail } from "@tabler/icons-react";
import axios from "axios";
import { useRef, useState } from "react";

interface FilterProps {
    filteredEmails: string[];
    // setFiltered: (emails: string[]) => void;
    form: UseFormReturnType<DraftForm>;
}

export default function Filter(props: FilterProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const emailListRef = useRef<HTMLTextAreaElement | null>(null);

    const onFilterHandler = async (): Promise<void> => {
        if (!emailListRef.current) return;

        let value = emailListRef.current.value;
        if (value.trim() === "") return;

        // Check email with regex
        const emails: string[] = value.split("\n").filter((email) => {
            const tmp = email.trim();
            if (/^\S+@\S+$/i.test(tmp)) {
                return tmp;
            }
        });

        if (emails.length === 0) return;

        // TODO: add email check with regex
        setLoading(true);
        const filtered = (await axios.get<AxiosResponse<string[]>>("/emails/filter", { params: { emails } })).data;
        if (filtered.success) {
            // props.setFiltered(filtered.data);
            props.form.setValues({ emails: filtered.data });
            emailListRef.current.value = "";
        } else {
            alert("Error: " + filtered.error);
        }

        setLoading(false);
    };

    return (
        <Paper withBorder p="md">
            <Text fw={700}>Select emails</Text>
            <Textarea
                error={props.form.errors.emails}
                mt={8}
                ref={emailListRef}
                placeholder="Paste emails from excel"
                autosize
                maxRows={10}
            />

            <Flex gap={8} mt={16} align={"center"}>
                <Button onClick={onFilterHandler} loading={loading} mr={8}>
                    Filter emails
                </Button>
                <IconMail size={24} color="gray" strokeWidth={1} />
                <Text size="lg" c="dimmed">
                    {props.filteredEmails.length}{" "}
                </Text>
            </Flex>

            {props.filteredEmails.length > 0 ? (
                <>
                    <Text fw={700} mt={16}>
                        Filtered emails
                    </Text>
                    <Flex gap={8} mt={8} wrap={"wrap"}>
                        {props.filteredEmails.map((e) => (
                            <Pill key={e}>{e}</Pill>
                        ))}
                    </Flex>
                </>
            ) : (
                <Text mt={16} fs={"italic"} c={"dimmed"}>
                    Filter some emails
                </Text>
            )}
        </Paper>
    );
}
