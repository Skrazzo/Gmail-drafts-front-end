import SearchParamsHelper from "@/helpers/SearchParamsHelper";
import { Button, Checkbox, Flex, Group, Modal, MultiSelect, Paper, Radio, Skeleton, Stack, Text } from "@mantine/core";
import { useState } from "react";
import useIdsHelper from "@/hooks/useIdsHelper";
import type { IdsHelper } from "@/hooks/useIdsHelper";
import StackRow from "@/components/ui/StackRow";
import { DatePicker, DateValue } from "@mantine/dates";
import dayjs from "dayjs";
import { IconFilter } from "@tabler/icons-react";

interface Props {
    close: () => void;
    opened: boolean;
    searchEmails: (emailArray?: string[]) => void;
}

/**
 * Ct -> company tag
 * hct -> has company tag
 * et -> email tag
 * het -> has email tag
 * cty -> company type
 * hcty -> has company type
 * date -> date
 * dbe -> date before
 * dhcom -> doesnt have communication
 * e1 -> One email from company
 */
export interface Filter {
    ct: number[];
    hct: boolean;
    et: number[];
    het: boolean;
    cty: number[];
    hcty: boolean;
    date: string;
    dbe: boolean;
    dhcom: boolean;
    e1: boolean;
}
export default function AdvancedSearchModal(props: Props) {
    const params = new SearchParamsHelper();
    const [values, setValues] = useState<Filter>({
        ct: params.getIds("ct"),
        hct: params.getBoolean("hct"),
        et: params.getIds("et"),
        het: params.getBoolean("het"),
        cty: params.getIds("cty"),
        hcty: params.getBoolean("hcty"),
        date: params.get("date"),
        dbe: params.getBoolean("dbe"),
        dhcom: params.getBoolean("dhcom"),
        e1: params.getBoolean("e1"),
    });

    const tags = useIdsHelper("/tags/get");
    const type = useIdsHelper("/types/get");

    const onBooleanChange = (key: keyof Filter): void => {
        if (!values) return;
        setValues({ ...values, [key]: !values[key] });
        params.setBoolean(key, !values[key]);
    };

    const onIdsChange = (key: keyof Filter, data: string[], idsHook: IdsHelper): void => {
        if (!values) return;
        const ids = idsHook.idsFromNames(data);
        params.setIds(key, ids);
        setValues({ ...values, [key]: ids });
    };

    const onDateChange = (date: DateValue) => {
        if (!values) return;

        params.setDate("date", date);
        if (date) {
            setValues({ ...values, date: dayjs(date).format(params.dateFormat) });
        } else {
            setValues({ ...values, date: "" });
        }
    };

    const handleEmailsFromClipboard = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        try {
            const text = await navigator.clipboard.readText();
            const emails = text
                .split(/\s+|,|;|\n/) // Split by whitespace, commas, semicolons, or newlines
                .map((email) => email.trim().toLowerCase())
                .filter((email) => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

            // 'emails' now contains cleaned valid email addresses
            props.searchEmails(emails);
        } catch (error) {
            console.error("Failed to read clipboard:", error);
            props.searchEmails();
        } finally {
            props.close();
        }
    };

    return (
        <Modal title="Advanced search" size={"xl"} opened={props.opened} onClose={props.close}>
            {tags.loading ? (
                <Skeleton w={"100%"} h={45} />
            ) : (
                <Stack>
                    <StackRow title="Company tags">
                        <MultiSelect
                            flex={1}
                            searchable
                            placeholder="Pick tags"
                            defaultValue={tags.namesFromIds(values?.ct)}
                            data={[...tags.names()]}
                            onChange={(data) => onIdsChange("ct", data, tags)}
                        />

                        <Group>
                            <Radio label="Has" checked={values?.hct} onChange={() => onBooleanChange("hct")} />
                            <Radio
                                label={`Doesn't have`}
                                checked={!values?.hct}
                                onChange={() => onBooleanChange("hct")}
                            />
                        </Group>
                    </StackRow>

                    <StackRow title="Company type">
                        <MultiSelect
                            flex={1}
                            searchable
                            placeholder="Pick types"
                            defaultValue={type.namesFromIds(values?.cty)}
                            data={[...type.names()]}
                            onChange={(data) => onIdsChange("cty", data, type)}
                        />

                        <Group>
                            <Radio label="Has" checked={values?.hcty} onChange={() => onBooleanChange("hcty")} />
                            <Radio
                                label={`Doesn't have`}
                                checked={!values?.hcty}
                                onChange={() => onBooleanChange("hcty")}
                            />
                        </Group>
                    </StackRow>

                    <StackRow title="Email tag">
                        <MultiSelect
                            flex={1}
                            searchable
                            placeholder="Pick tags"
                            defaultValue={tags.namesFromIds(values?.et)}
                            data={[...tags.names()]}
                            onChange={(data) => onIdsChange("et", data, tags)}
                        />

                        <Group>
                            <Radio label="Has" checked={values?.het} onChange={() => onBooleanChange("het")} />
                            <Radio
                                label={`Doesn't have`}
                                checked={!values?.het}
                                onChange={() => onBooleanChange("het")}
                            />
                        </Group>
                    </StackRow>

                    <Paper withBorder w={"100%"} p={"sm"}>
                        <StackRow title="Additional email options">
                            <Checkbox
                                label={"Select only one email from company"}
                                checked={values.e1}
                                onChange={() => onBooleanChange("e1")}
                            />
                        </StackRow>
                    </Paper>

                    <StackRow title="">
                        <Flex w="100%" gap={"lg"}>
                            <DatePicker value={new Date(values.date)} allowDeselect onChange={onDateChange} />
                            <Stack>
                                <Text>Last date of communication</Text>
                                <Radio
                                    onChange={() => onBooleanChange("dbe")}
                                    checked={values.dbe}
                                    label="Before this date"
                                />
                                <Radio
                                    onChange={() => onBooleanChange("dbe")}
                                    checked={!values.dbe}
                                    label="After this date"
                                />
                                <Checkbox
                                    label={"No communication with this email"}
                                    checked={values.dhcom}
                                    onChange={() => onBooleanChange("dhcom")}
                                />
                            </Stack>
                        </Flex>
                    </StackRow>

                    <Group grow>
                        <Button
                            onClick={() => {
                                props.searchEmails();
                                props.close();
                            }}
                            variant="light"
                            leftSection={<IconFilter size={20} />}
                        >
                            Apply filters
                        </Button>
                        <Button variant="outline" onClick={(e) => handleEmailsFromClipboard(e)}>
                            Take emails from clipboard
                        </Button>
                    </Group>
                </Stack>
            )}
        </Modal>
    );
}
