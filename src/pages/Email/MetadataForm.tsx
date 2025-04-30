import { useForm } from "@mantine/form";
import {
    Button,
    Checkbox,
    Group,
    NumberInput,
    Paper,
    Select,
    SimpleGrid,
    Stack,
    Text,
    Textarea,
    TextInput,
} from "@mantine/core";
import { DecodedInputSource, EmailMetadata } from "@/types";
import TagCombobox from "@/components/ui/Combobox/IdCombobox";
import getInputSourceClass from "@/functions/getInputSourceClass";

import moment from "moment";
import { countriesSelectData } from "@/functions/countriesSelectData";

interface EmailFormProps {
    initialData: EmailMetadata;
    onSubmit: (values: EmailMetadata) => void;
    isReadOnly: (column: string) => boolean;
    loading: boolean;
}

export function EmailForm({ initialData, onSubmit, isReadOnly, loading }: EmailFormProps) {
    const form = useForm<EmailMetadata>({
        initialValues: initialData,
    });

    const inputSource = JSON.parse(initialData.input_source) as DecodedInputSource;

    const submitForm = () => {
        if (!form.isValid()) {
            form.validate();
            return;
        }

        // Convert tags
        const currentTags: number[] = form.values.tags || [];
        if (currentTags.length === 0) {
            form.setValues({ tags: [] });
        }

        onSubmit(form.getValues());
    };

    return (
        <Paper p="md" withBorder>
            <form onSubmit={(e) => e.preventDefault()}>
                <Stack gap="md">
                    <SimpleGrid cols={2}>
                        {/* Contact Information */}
                        <TextInput label="Email" {...form.getInputProps("email")} disabled={isReadOnly("email")} />

                        <TagCombobox
                            baseUrl="tags"
                            formColumn="tags"
                            form={form}
                            className={getInputSourceClass(inputSource?.tags, true)}
                        />

                        <TextInput
                            label="Person Name"
                            placeholder="Enter person name"
                            {...form.getInputProps("person_name")}
                            disabled={isReadOnly("person_name")}
                            className={getInputSourceClass(inputSource?.person_name)}
                        />

                        <TextInput
                            label="Person Position"
                            placeholder="Enter person position"
                            {...form.getInputProps("person_position")}
                            disabled={isReadOnly("person_position")}
                            className={getInputSourceClass(inputSource?.person_position)}
                        />

                        <Select
                            label="Country"
                            searchable
                            clearable
                            data={countriesSelectData()}
                            {...form.getInputProps("country")}
                            disabled={isReadOnly("country")}
                            className={getInputSourceClass(inputSource?.country)}
                        />

                        <TextInput
                            label="Phone Number"
                            placeholder="Enter phone number"
                            {...form.getInputProps("phone_number")}
                            disabled={isReadOnly("phone_number")}
                            className={getInputSourceClass(inputSource?.phone_number)}
                        />

                        {/* Additional Information */}

                        <Select
                            label="Met in Person"
                            placeholder="Select option"
                            data={[
                                { value: "Yes", label: "Yes" },
                                { value: "No", label: "No" },
                            ]}
                            {...form.getInputProps("met_in_person")}
                            disabled={isReadOnly("met_in_person")}
                            clearable
                            className={getInputSourceClass(inputSource?.met_in_person)}
                        />

                        <NumberInput
                            label="Interest Level"
                            placeholder="Enter interest (0-10)"
                            min={0}
                            max={10}
                            {...form.getInputProps("interest")}
                            disabled={isReadOnly("interest")}
                            className={getInputSourceClass(inputSource?.interest)}
                        />

                        <TextInput
                            label="Address"
                            placeholder="Enter address"
                            {...form.getInputProps("address")}
                            disabled={isReadOnly("address")}
                            className={getInputSourceClass(inputSource?.address)}
                        />

                        <TextInput
                            label="Postal code"
                            placeholder="Enter postal code"
                            {...form.getInputProps("postal_code")}
                            disabled={isReadOnly("postal_code")}
                            className={getInputSourceClass(inputSource?.postal_code)}
                        />

                        <Checkbox
                            label="Primary email"
                            size="md"
                            disabled={isReadOnly("primary")}
                            {...form.getInputProps("primary", { type: "checkbox" })}
                        />
                    </SimpleGrid>

                    <Textarea
                        label="Comment"
                        placeholder="Enter comment"
                        minRows={3}
                        {...form.getInputProps("last_comment")}
                        disabled={isReadOnly("last_comment")}
                        className={getInputSourceClass(inputSource?.last_comment)}
                    />

                    {/* Recent Email Details - Read Only */}
                    <Paper withBorder p="sm">
                        <Text size="sm" fw={500} mb="xs">
                            Recent Emails (Read Only)
                        </Text>
                        {initialData.last_sent_subject && (
                            <div className="mb-3">
                                <Text size="sm" fw={500}>
                                    Last Sent Email: {moment(initialData.last_sent_date).format("MMMM Do YYYY, HH:mm")}
                                </Text>
                                <Text size="sm" c="dimmed">
                                    Subject: {initialData.last_sent_subject}
                                </Text>
                                <Text size="sm" c="dimmed">
                                    Snippet: {initialData.last_sent_snippet}
                                </Text>
                            </div>
                        )}
                        {initialData.last_received_subject && (
                            <div>
                                <Text size="sm" fw={500}>
                                    Last Received Email:{" "}
                                    {moment(initialData.last_received_date).format("MMMM Do YYYY, HH:mm")}
                                </Text>
                                <Text size="sm" c="dimmed">
                                    Subject: {initialData.last_received_subject}
                                </Text>
                                <Text size="sm" c="dimmed">
                                    Snippet: {initialData.last_received_snippet}
                                </Text>
                            </div>
                        )}
                    </Paper>

                    <Group>
                        <Button type="submit" loading={loading} onClick={submitForm}>
                            Save Changes
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Paper>
    );
}
