import { EmailSearch } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ActionIcon, Button, CopyButton, Flex, Input, Loader, Table, Text, Title, Tooltip } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import AdvancedSearchModal from "./Email/AdvancedSearchModal";
import SearchParamsHelper from "@/helpers/SearchParamsHelper";
import { AdvancedFilter } from "@/functions/AdvancedFilter";
import { IconCheck, IconCopy, IconMail } from "@tabler/icons-react";
import dayjs from "dayjs";
import IconExport from "@/CustomIcons/IconExport";
import Requests from "@/functions/Requests";
import { notifications } from "@mantine/notifications";

export default function Emails() {
    const params = new SearchParamsHelper();
    const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
    const [list, setList] = useState<EmailSearch[]>([]);
    const [displayedList, setDisplayedList] = useState<EmailSearch[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const firstRender = useRef(true);
    const [loading, setLoading] = useState<boolean>(true);
    const BATCH_SIZE = 50;

    const fetchList = async () => {
        setLoading(true);
        const tmp = await axios.get<EmailSearch[]>("/emails/list", { params: { search: searchQuery } });

        const filtered = AdvancedFilter(tmp.data, params);

        setList(filtered);
        setDisplayedList(filtered.slice(0, BATCH_SIZE));
        setCurrentIndex(BATCH_SIZE);
        setLoading(false);
    };

    const loadMore = () => {
        if (currentIndex >= list.length) return;

        const nextIndex = currentIndex + BATCH_SIZE;
        setDisplayedList([...displayedList, ...list.slice(currentIndex, nextIndex)]);
        setCurrentIndex(nextIndex);
    };

    useEffect(() => {
        fetchList()
            .catch(console.error)
            .finally(() => {
                firstRender.current = false;
            });
    }, []);

    const [searchQuery, setSQ] = useState<string>(params.get("q") || "");
    useEffect(() => {
        if (firstRender.current) return;

        const t = setTimeout(() => {
            fetchList();
            params.set("q", searchQuery);
            // setSearchParams({ q: searchQuery });
        }, 1000);

        return () => {
            clearTimeout(t);
        };
    }, [searchQuery]);

    const onExportSubmitHandler = () => {
        Requests.post<string>({
            url: "/create/export",
            data: { emails: list.map((e) => e.email) },
            success(_data) {
                notifications.show({
                    title: "Export creating",
                    message: "Export will be send to your info@cuentosconvalor.es when its finished",
                    color: "green",
                });
            },
        });
    };

    return (
        <>
            <AdvancedSearchModal
                searchEmails={fetchList}
                opened={advancedSearchOpen}
                close={() => setAdvancedSearchOpen(false)}
            />
            <Flex align={"center"} gap={8}>
                <Title mr={16}>Email list</Title>
                <IconMail color="gray" stroke={1.25} size={20} />
                <Text fw={"bold"} size="lg" mr={8} c="dimmed">
                    {list.length}
                </Text>

                <CopyButton value={list.map((e) => e.email).join("\n")} timeout={2000}>
                    {({ copied, copy }) => (
                        <Tooltip label={copied ? "Copied" : "Copy"} withArrow>
                            <ActionIcon color={copied ? "teal" : "gray"} variant="subtle" onClick={copy}>
                                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                            </ActionIcon>
                        </Tooltip>
                    )}
                </CopyButton>

                <Tooltip label={"Export emails"} withArrow>
                    <ActionIcon size={"sm"} variant="subtle" color="gray" onClick={onExportSubmitHandler}>
                        <IconExport />
                    </ActionIcon>
                </Tooltip>
            </Flex>
            <Flex my={16} gap={8}>
                <Input.Wrapper label="Search input" flex={1}>
                    <Input
                        value={searchQuery}
                        placeholder="Search email, company and person name"
                        onChange={(e) => setSQ(e.target.value)}
                    />
                </Input.Wrapper>
                <Flex direction={"column"} justify={"end"}>
                    <Button onClick={() => setAdvancedSearchOpen(true)}>Advanced filters</Button>
                </Flex>
            </Flex>

            <Table highlightOnHover className="">
                <Table.Tr>
                    <Table.Th>Int</Table.Th>
                    <Table.Th>Co</Table.Th>
                    <Table.Th>Pri</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Position</Table.Th>
                    <Table.Th>Email address</Table.Th>
                    <Table.Th>Tags</Table.Th>
                    <Table.Th>Company name</Table.Th>
                    <Table.Th>Last com</Table.Th>
                </Table.Tr>

                {loading ? <Loader m={16} /> : <TableRows list={displayedList} onBottomReach={loadMore} />}
            </Table>
        </>
    );
}

const TableRows = React.memo(function TableRows({
    list,
    onBottomReach,
}: {
    list: EmailSearch[];
    onBottomReach: () => void;
}): JSX.Element {
    const navigate = useNavigate();
    const lastRowRef = useRef<HTMLTableRowElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    onBottomReach();
                }
            },
            { threshold: 0.5 }
        );

        if (lastRowRef.current) {
            observer.observe(lastRowRef.current);
        }

        return () => observer.disconnect();
    }, [list]);

    const navigateToEmail = (id: number) => {
        navigate("/email/" + id);
    };

    return (
        <>
            {list.map((item, idx) => (
                <Table.Tr
                    key={idx}
                    onClick={() => navigateToEmail(item.id)}
                    ref={idx === list.length - 1 ? lastRowRef : null}
                >
                    <Table.Td>{item.interest || "-"}</Table.Td>
                    <Table.Td>{item.country || "-"}</Table.Td>
                    <Table.Td>{item.primary ? "Yes" : "-"}</Table.Td>
                    <Table.Td>{item.person_name || "-"}</Table.Td>
                    <Table.Td>{item.person_position || "-"}</Table.Td>
                    <Table.Td>{item.email || "-"}</Table.Td>
                    <Table.Td>{item.tags || "-"}</Table.Td>
                    <Table.Td>{item.company_name || "-"}</Table.Td>
                    <Table.Td>
                        {item.last_communication_date ? dayjs(item.last_communication_date).format("MMM DD, YY") : "-"}
                    </Table.Td>
                </Table.Tr>
            ))}
        </>
    );
});
