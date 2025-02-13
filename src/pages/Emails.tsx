import { EmailSearch } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Input, Table, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function Emails() {
    const [list, setList] = useState<EmailSearch[]>([]);
    const [displayedList, setDisplayedList] = useState<EmailSearch[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const firstRender = useRef(true);
    const BATCH_SIZE = 50;

    const fetchList = async () => {
        const tmp = await axios.get<EmailSearch[]>("/emails/list", { params: { search: searchQuery } });
        setList(tmp.data);
        setDisplayedList(tmp.data.slice(0, BATCH_SIZE));
        setCurrentIndex(BATCH_SIZE);
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

    const [searchQuery, setSQ] = useState<string>("");
    useEffect(() => {
        if (firstRender.current) return;

        const t = setTimeout(() => {
            fetchList();
        }, 1000);

        return () => {
            clearTimeout(t);
        };
    }, [searchQuery]);

    return (
        <>
            <Title>Email list</Title>
            <Input.Wrapper label="Search input" my={16}>
                <Input placeholder="Search email, company and person name" onChange={(e) => setSQ(e.target.value)} />
            </Input.Wrapper>

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
                </Table.Tr>

                <TableRows list={displayedList} onBottomReach={loadMore} />
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
                </Table.Tr>
            ))}
        </>
    );
});
