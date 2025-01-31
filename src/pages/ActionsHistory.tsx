import { Title } from "@mantine/core";
import type { ActionHistory } from "@/types";
import { useEffect, useState } from "react";
import Requests from "@/functions/Requests";
import { ActionsTable } from "@/components/actions/ActionsTable";

export default function ActionHistory() {
    const [actions, setActions] = useState<ActionHistory[] | null>(null);

    const fetchData = async () => {
        Requests.get<ActionHistory[]>({
            url: "/actions/history",
            success: (d) => {
                setActions(d);
            },
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Title mb={16}>Actions</Title>
            {actions && <ActionsTable actions={actions} />}
        </>
    );
}
