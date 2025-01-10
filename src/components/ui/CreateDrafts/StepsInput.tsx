import { ChangeEvent, useRef } from "react";
import { DraftForm } from "@/types";
import { UseFormReturnType } from "@mantine/form";
import { Paper, Text, Textarea } from "@mantine/core";

interface Props {
    form: UseFormReturnType<DraftForm>;
}

export default function StepsInput(props: Props) {
    const stepsRef = useRef(null);

    const stepsChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
        // Convert steps to array, and remove empty steps
        const steps: string[] = e.target.value.split("\n").filter((step) => step.trim() !== "");
        props.form.setValues({ steps });
    };

    return (
        <Paper withBorder p="md" mt={16}>
            <Text fw={700}>Write steps</Text>
            <Textarea
                error={props.form.errors.steps}
                mt={8}
                ref={stepsRef}
                placeholder="Write steps for the email"
                autosize
                maxRows={10}
                onChange={(e) => stepsChangeHandler(e)}
            />
        </Paper>
    );
}
