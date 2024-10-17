import axios from "axios";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

interface Draft {
    messages: {
        message: {
            snippet: string;
        };
    };
}

export default function Drafts() {
    const [drafts, setDrafts] = useState<Draft[] | null>(null);

    useEffect(() => {
        axios.get("/drafts").then((res) => {
            console.log(res.data);
            setDrafts(res.data);
        });
    }, []);

    return (
        <div>
            {drafts === null && (
                <div>
                    {new Array(10).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-6 w-full my-2" />
                    ))}
                </div>
            )}
            {drafts && (
                <table className="border-collapse border border-gray-400">
                    <tbody>
                        {drafts.map((draft, i) => (
                            <tr key={i} className="border border-gray-400 ">
                                <td className="p-2">
                                    {draft.messages.message.snippet}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
