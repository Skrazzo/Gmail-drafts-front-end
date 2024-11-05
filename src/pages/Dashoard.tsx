// src/pages/Dashboard.tsx
import { Container, Title, Text, Table, Grid, Skeleton } from "@mantine/core";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { errorMessage } from "@/global";
import { EmailInfo } from "@/types/dashboard";

const TableRowSkelets = () => {
    return new Array(6).fill(0).map((_, i) => (
        <Table.Tr key={i}>
            {new Array(3).fill(0).map((_, i) => (
                <Table.Td key={i}>
                    <Skeleton h={30} />
                </Table.Td>
            ))}
        </Table.Tr>
    ));
};

export function DashboardPage() {
    const { user } = useAuth();

    const [info, setInfo] = useState<EmailInfo | null>(null);

    useEffect(() => {
        axios
            .get("/info")
            .then((res) => {
                setInfo(res.data);
            })
            .catch((err) => {
                alert(errorMessage("Error appeared when fetching information"));
                console.error(err);
            });
    }, []);

    useEffect(() => {
        console.log(info);
    }, [info]);

    return (
        <Container size="lg">
            <Title order={2}>Dashboard</Title>

            <Table mt={16}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th></Table.Th>
                        <Table.Th>Last outgoing</Table.Th>
                        <Table.Th>Last incoming</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {info !== null ? (
                        Object.keys(info.outgoing.last).map((key) => (
                            <Table.Tr key={key}>
                                <Table.Td fw={"bold"}>{key}</Table.Td>
                                <Table.Td>{info.outgoing.last[key]}</Table.Td>
                                <Table.Td>{info.incoming.last[key]}</Table.Td>
                            </Table.Tr>
                        ))
                    ) : (
                        <TableRowSkelets />
                    )}
                </Table.Tbody>
            </Table>
        </Container>
    );
}
