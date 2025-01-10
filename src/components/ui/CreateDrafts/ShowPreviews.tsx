import { DraftPreview } from "@/types";
import { Select, Text } from "@mantine/core";
import { useEffect, useState } from "react";

interface Props {
    preview: DraftPreview;
}

export default function ShowPreviews({ preview }: Props) {
    const [selectedStep, setSelectedStep] = useState<string | null>(null);

    useEffect(() => {
        // On initial render ig
        if (preview.steps && preview.data.length > 0) {
            // Select first step
            setSelectedStep("0");
        }
    }, [preview]);

    if (preview.steps) {
        if (preview.data.length === 0) return <>No previews received</>;

        return (
            <>
                <Text mt={8}>Select step to preview</Text>
                <Select
                    data={[...preview.data.map((el, idx) => ({ value: idx.toString(), label: el.step }))]}
                    value={selectedStep}
                    placeholder="Select step"
                    onChange={(e) => setSelectedStep(e)}
                />

                {selectedStep === null ? (
                    <></>
                ) : (
                    <div className="mt-4 border rounded p-2">
                        <div
                            className="prose"
                            style={{ maxWidth: "100%" }}
                            dangerouslySetInnerHTML={{ __html: preview.data[parseInt(selectedStep)].preview }}
                        />
                    </div>
                )}
            </>
        );
    } else {
        if (preview.data === "") return <></>;

        return (
            <div className="mt-4 border rounded p-2">
                <div
                    className="prose"
                    style={{ maxWidth: "100%" }}
                    dangerouslySetInnerHTML={{ __html: preview.data }}
                />
            </div>
        );
    }
}
