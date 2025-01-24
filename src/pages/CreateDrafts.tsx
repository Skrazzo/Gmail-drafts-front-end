import EmailContent from "@/components/ui/CreateDrafts/EmailContent";
import Filter from "@/components/ui/CreateDrafts/Filter";
import TemplateSelection from "@/components/ui/CreateDrafts/TemplateSelection";
import { AxiosResponse, DraftForm } from "@/types";
import { Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import StepsInput from "@/components/ui/CreateDrafts/StepsInput";
import type { AvailableFromEmails } from "@/types";
import { useEffect, useState } from "react";

export default function CreateDrafts() {
    const [availableEmails, setAvailableEmails] = useState<AvailableFromEmails[]>([]);
    const form = useForm<DraftForm>({
        initialValues: {
            subject: "",
            email_from: "me",
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
            email_from: (e) => (e === null || e === "" || e === "me" ? "Please select email address" : null),
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

    // Fetch available emails
    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const res = (await axios.get<AxiosResponse<AvailableFromEmails[]>>("/emails/connected")).data;
                if (!res.success) {
                    notifications.show({
                        title: "Error",
                        message: res.error,
                        color: "red",
                    });
                    return;
                }

                setAvailableEmails(res.data);

                // Set default email in form
                const defaultEmail = res.data.find((email) => email.isDefault);
                if (defaultEmail) {
                    form.setFieldValue("email_from", defaultEmail.email);
                }
            } catch (error) {
                console.error("Failed to fetch connected emails:", error);
                notifications.show({
                    title: "Error",
                    message: "Failed to load connected email addresses",
                    color: "red",
                });
            }
        };

        fetchEmails();
    }, []);

    return (
        <>
            <Title mb={16}>Create drafts</Title>

            <Filter form={form} filteredEmails={form.values.emails} />
            <EmailContent form={form} availableEmails={availableEmails} />
            <StepsInput form={form} />
            <TemplateSelection form={form} onSubmit={submitHandler} />
        </>
    );
}
