import EmailContent from "@/components/ui/CreateDrafts/EmailContent";
import Filter from "@/components/ui/CreateDrafts/Filter";
import TemplateSelection from "@/components/ui/CreateDrafts/TemplateSelection";
import { AxiosResponse, DraftForm } from "@/types";
import { Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import StepsInput from "@/components/ui/CreateDrafts/StepsInput";

export default function CreateDrafts() {
    const form = useForm<DraftForm>({
        initialValues: {
            subject: "",
            body: "<p></p>",
            attachments: null,
            bodyTemplate: null,
            signatureTemplate: null,
            emails: [],
            steps: [],
            stepsRepeat: 1,
        },

        validate: {
            emails: (e) => (!e || e.length === 0 ? "Emails cannot be empty" : null),
            subject: (e) => (e ? null : "Subject cannot be empty"),
            // body: (e) => (e === "<p></p>" || e === null || e === "") ? "Email body cannot be empty" : null,
            bodyTemplate: (e) => (e === null ? "Please select template for email body" : null),
            stepsRepeat: (e) => (e < 1 || !e ? "Must be a positive number" : null),
        },
    });

    const submitHandler = async () => {
        if (!form.isValid()) {
            form.validate();
            return;
        }

        const formData = new FormData();
        const values = form.getValues();

        // add data to formdata
        Object.keys(values).forEach((key) => {
            if (Array.isArray(values[key])) {
                // Add array to formdata
                values[key].forEach((el) => {
                    formData.append(key, el);
                });
            } else {
                // append value
                if (values[key] !== null && values[key] !== "null") {
                    formData.append(key, values[key]);
                }
            }
        });

        try {
            const res = await axios.post<AxiosResponse<string>>("/drafts/queue/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            form.reset();
            if (res.data.success) {
                notifications.show({
                    withBorder: true,
                    radius: "md",
                    title: "Drafts created",
                    message: res.data.data,
                });
            }
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    return (
        <>
            <Title mb={16}>Create drafts</Title>
            <Filter form={form} filteredEmails={form.values.emails} />
            <EmailContent form={form} />
            <StepsInput form={form} />
            <TemplateSelection form={form} onSubmit={submitHandler} />
        </>
    );
}
