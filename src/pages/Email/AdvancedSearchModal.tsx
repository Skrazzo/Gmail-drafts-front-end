import SearchParamsHelper from "@/helpers/SearchParamsHelper";
import { Button, Flex, Group, Modal, MultiSelect, Radio, Skeleton, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import useIdsHelper from "@/hooks/useIdsHelper";
import type { IdsHelper } from "@/hooks/useIdsHelper";
import StackRow from "@/components/ui/StackRow";
import { DatePicker, DateValue } from "@mantine/dates";
import dayjs from "dayjs";
import { IconFilter } from "@tabler/icons-react";

interface Props {
    close: () => void;
    opened: boolean;
    searchEmails: () => void;
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
                            </Stack>
                        </Flex>
                    </StackRow>

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
                </Stack>
            )}
        </Modal>
    );
}
