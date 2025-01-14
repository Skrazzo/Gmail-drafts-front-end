import { ChangeEvent, useRef } from "react";
import { DraftForm } from "@/types";
import { UseFormReturnType } from "@mantine/form";
import { NumberInput, Paper, Text, Textarea } from "@mantine/core";

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

    const repeatChangeHandler = (e: string | number) => {
        let num: number;

        if (typeof e === "number") {
            num = e;
        } else {
            num = parseInt(e);
        }

        if (num < 1) return;
        if (!num) return;

        // props.form.clearFieldError("stepsRepeat");
        props.form.setValues({ stepsRepeat: num });
    };

    return (
        <Paper withBorder p="md" mt={16}>
            <Text fw={700} mb={16}>
                Steps and replacements
            </Text>
            <NumberInput
                min={1}
                max={1000}
                value={props.form.values.stepsRepeat}
                error={props.form.errors.stepsRepeat}
                onChange={repeatChangeHandler}
                label={"Steps repeat"}
            />
            <Textarea
                label={"Write replacement for $$$"}
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
