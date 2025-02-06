import { EmailSearch } from "@/types";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Input, Table, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function Emails() {
    const [list, setList] = useState<EmailSearch[]>([]);
    const firstRender = useRef(true);
    const navigate = useNavigate();

    const fetchList = async () => {
        const tmp = await axios.get<EmailSearch[]>("/emails/list", { params: { search: searchQuery } });
        setList(tmp.data);
    };

    const navigateToEmail = (id: number) => {
        navigate("/email/" + id);
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

                {list.map((item, idx) => (
                    <Table.Tr key={idx} onClick={() => navigateToEmail(item.id)}>
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
            </Table>
        </>
    );
}
