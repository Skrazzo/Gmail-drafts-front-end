import { ActionHistory } from "@/types";
import { Table } from "@mantine/core";
import { useState } from "react";
import { SubCategoryDisplay } from "./SubCategoryDisplay";
import moment from "moment";

interface ActionsTableProps {
    actions: ActionHistory[];
}

export function ActionsTable({ actions }: ActionsTableProps) {
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    const toggleRow = (id: number) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    return (
        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Action</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Created At</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {actions.map((action) => (
                    <>
                        <Table.Tr
                            key={action.id}
                            style={{
                                cursor: action.type !== "message" ? "pointer" : "default",
                            }}
                            onClick={() => {
                                if (action.type !== "message") {
                                    toggleRow(action.id);
                                }
                            }}
                        >
                            <Table.Td>{action.action}</Table.Td>
                            <Table.Td>{action.type}</Table.Td>
                            <Table.Td c="dimmed">
                                {action.created_at ? moment(action.created_at).format("YYYY-MM-DD HH:mm:ss") : "-"}
                            </Table.Td>
                        </Table.Tr>
                        {action.type !== "message" && expandedRows.has(action.id) && (
                            <Table.Tr key={`${action.id}-expanded`}>
                                <Table.Td colSpan={4}>
                                    <SubCategoryDisplay type={action.type} subCategory={action.sub_category} />
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </>
                ))}
            </Table.Tbody>
        </Table>
    );
}
