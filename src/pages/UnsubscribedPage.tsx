import { Table, Skeleton, Container, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";
import { AxiosResponse, UnsubscribedData } from "@/types";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export default function UnsubscribedPage() {
    const [data, setData] = useState<UnsubscribedData[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<AxiosResponse<UnsubscribedData[]>>("/unsubscribed");
                if (response.data.success) {
                    setData(response.data.data);
                } else {
                    console.error("Failed to fetch data:", response.data.error);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Container size="xl" mt="md">
                <Skeleton height={40} mb="xl" />
                <Skeleton height={400} />
            </Container>
        );
    }

    return (
        <>
            <Title mb="xl">Unsubscribed Emails</Title>
            <Table highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Person Name</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Reason</Table.Th>
                        <Table.Th>Date</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {data.map((item) => (
                        <Table.Tr
                            key={item.email_id}
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(`/email/${item.email_id}`)}
                        >
                            <Table.Td>{item.person_name || "-"}</Table.Td>
                            <Table.Td>{item.email}</Table.Td>
                            <Table.Td>{item.reason}</Table.Td>
                            <Table.Td>{moment(item.updated_at).format("YYYY/DD/MM, H:mm:ss")}</Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </>
    );
}
