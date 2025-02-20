import { useEffect, useState } from "react";
import Requests from "@/functions/Requests";

interface Id {
    id: number;
    name: string;
}

export default function useIdsHelper(url: string) {
    const [ids, setIds] = useState<Id[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        Requests.get<Id[]>({
            url,
            success: (data) => {
                setIds(data);
                setLoading(false);
            },
        });
    }, [url]);

    const idsFromNames = (names: string[] | undefined): number[] => {
        if (!names) return [];
        return ids.filter((id) => names.includes(id.name)).map((id) => id.id);
    };

    const namesFromIds = (idsArray: number[] | undefined): string[] => {
        if (!idsArray) return [];
        return idsArray.map((id) => ids.find((idObj) => idObj.id === id)?.name || "").filter((name) => name !== "");
    };

    return {
        ids,
        loading,
        names: () => ids.map((id) => id.name),
        idsFromNames,
        namesFromIds,
    };
}

export interface IdsHelper {
    ids: Id[];
    loading: boolean;
    names: () => string[];
    idsFromNames: (names: string[]) => number[];
}
