import { AvailableTemplates, AxiosResponse, DraftForm, DraftPreview } from "@/types";
import { Button, Flex, Group, Paper, Select, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import axios from "axios";
import { ReactElement, useEffect, useState } from "react";
import ShowPreviews from "./ShowPreviews";

interface TemplateSelectionProps {
    form: UseFormReturnType<DraftForm>;
    onSubmit: () => void;
}

export default function TemplateSelection(props: TemplateSelectionProps): ReactElement {
    const [templates, setTemplates] = useState<AvailableTemplates | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [preview, setPreview] = useState<DraftPreview>({ steps: false, data: "" });

    const loadPreview = async (): Promise<void> => {
        const formValues = props.form.values;
        if (!formValues.bodyTemplate) {
            props.form.setFieldError("bodyTemplate", "Cannot be empty");
            return;
        }

        setLoading(true);
        axios
            .get<DraftPreview>("/preview/template", {
                params: {
                    message: formValues.body,
                    bodyTemplate: formValues.bodyTemplate,
                    signatureTemplate: formValues.signatureTemplate,
                    steps: formValues.steps,
                },
            })
            .then((res) => {
                setPreview(res.data);
            })
            .catch((err) => {
                alert("Error while fetching templates: " + err);
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const fetchTemplates = async (): Promise<void> => {
        setLoading(true);

        const data = (await axios.get<AxiosResponse<AvailableTemplates>>("/available/templates")).data;
        if (data.success) {
            setTemplates(data.data);
        } else {
            alert("Error while fetching templates: " + data.error);
            console.error(data.error);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    return (
        <Paper withBorder p={"md"} mt={16}>
            <Text fw={700}>Template selection and preview</Text>

            <Group grow mt={8}>
                <Select
                    label={"Body template"}
                    data={templates?.bodies}
                    disabled={!templates}
                    {...props.form.getInputProps("bodyTemplate")}
                />
                <Select
                    label={"Signature template"}
                    data={templates?.signatures}
                    disabled={!templates}
                    {...props.form.getInputProps("signatureTemplate")}
                />
            </Group>

            <ShowPreviews preview={preview} />

            <Flex gap={8} mt={16}>
                <Button loading={loading} onClick={loadPreview}>
                    Load preview
                </Button>
                <Button loading={loading} onClick={props.onSubmit} variant="light">
                    Put drafts in queue
                </Button>
            </Flex>
        </Paper>
    );
}
