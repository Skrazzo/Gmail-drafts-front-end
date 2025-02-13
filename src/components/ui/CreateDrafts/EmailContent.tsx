import { AvailableFromEmails, DraftForm, Tag } from "@/types";
import { ComboboxData, Group, Input, Paper, Select, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import RichEditor from "../RichEditor";
import { ReactElement, useEffect, useState } from "react";
import FileSelect from "../FileSelect";
import requests from "@/functions/Requests";

interface EmailContentProps {
    form: UseFormReturnType<DraftForm>;
    availableEmails: AvailableFromEmails[];
}

export default function EmailContent(props: EmailContentProps): ReactElement {
    const [markTags, setMarkTags] = useState<ComboboxData | undefined>();
    function richChangeHandler(html: string) {
        props.form.setValues({ body: html });
    }

    useEffect(() => {
        requests.get<Tag[]>({
            url: "/tags/get",
            success: (data) => {
                setMarkTags(data.map((tag) => ({ label: tag.name, value: tag.name })));
            },
        });
    }, []);

    return (
        <>
            <Paper withBorder p="md" mt={16}>
                <Text fw={700}>Email content</Text>
                <Select
                    label="From Email"
                    placeholder="Select sender email"
                    clearable={false}
                    mt={8}
                    data={props.availableEmails.map((email) => ({
                        value: email.email,
                        label: email.name ? `${email.name} - ${email.email}` : email.email,
                    }))}
                    {...props.form.getInputProps("email_from")}
                />

                <Group grow gap={8}>
                    <Input my={8} placeholder="Email subject" {...props.form.getInputProps("subject")} />

                    <Select
                        {...props.form.getInputProps("mark_tag")}
                        searchable
                        placeholder="Select tag to mark these emails"
                        data={markTags}
                    />
                </Group>

                <RichEditor value={props.form.values.body} onChange={richChangeHandler} />
                <FileSelect
                    value={props.form.values.attachments}
                    onChange={(files) => props.form.setValues({ attachments: files })}
                    my={8}
                    label=""
                    placeholder="Click here to add attachments"
                    multiple
                />
            </Paper>
        </>
    );
}
