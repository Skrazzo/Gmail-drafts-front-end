import { EmailMetadata } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmailForm } from "./MetadataForm";
import EditCompany from "./EditCompany";
import { notifications } from "@mantine/notifications";

export default function EditEmail() {
    const { id } = useParams();
    const [emailData, setED] = useState<null | EmailMetadata>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const fetchData = async () => {
        const data = await axios.get<EmailMetadata>(`/emails/${id}/get`);
        setED(data.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const isReadOnly = (column: string): boolean => {
        const readOnly = [
            "id",
            "company_id",
            "company_name",
            "company_type",
            "email",
            "last_sent_date",
            "last_sent_snippet",
            "last_sent_subject",
            "recieved_email",
            "sent_email",
        ];

        return readOnly.includes(column);
    };

    const handleSubmit = (values: EmailMetadata) => {
        setLoading(true);
        // Remove all null and empty values, company fields

        Object.keys(values).forEach((key: string) => {
            if (values[key] === null || values[key] === "") {
                delete values[key];
            }

            if (isReadOnly(key)) {
                // Email is exception
                if (key !== "email") {
                    delete values[key];
                }
            }
        });

        // update email info
        axios
            .put(`/email_info`, { ...values })
            .then((res) => {
                if (!res.data.success) {
                    notifications.show({
                        withBorder: true,
                        radius: "md",
                        title: "Server error",
                        color: "red",
                        message: res.data.error.toString(),
                    });
                    console.log(res.data.error);
                } else {
                    // Show notification
                    notifications.show({
                        withBorder: true,
                        radius: "md",
                        title: "New email info saved",
                        message: `Email info for ${values.email} was saved successfully`,
                    });
                }
            })
            .finally(async () => {
                await fetchData();
                setLoading(false);
            });
    };

    function companyUpdateHandler(): void {
        // Refresh current page
        navigate(0);
    }

    function navigateToEmail(emailId: number): void {
        navigate(`/email/${emailId}`);
        navigate(0);
    }

    if (id === undefined) {
        return <p>email id is not specified</p>;
    }

    return (
        <>
            {!emailData ? (
                <p>Loading...</p>
            ) : (
                <div className="max-w-6xl mx-auto p-4">
                    <EditCompany
                        onUpdate={companyUpdateHandler}
                        email_id={Number(id)}
                        company_name={emailData.company_name || ""}
                        company_type={emailData.company_type || ""}
                        company_tags={emailData.company_tags || []}
                        company_logo={emailData.company_logo || null}
                        company_website={emailData.company_website || ""}
                        company_address={emailData.company_address}
                        company_id={emailData.company_id}
                        company_input_source={emailData.company_input_source}
                        company_country={emailData.company_country}
                        company_postal_code={emailData.company_postal_code}
                        navigateToEmail={navigateToEmail}
                    />

                    <EmailForm
                        loading={loading}
                        initialData={emailData}
                        onSubmit={handleSubmit}
                        isReadOnly={isReadOnly}
                    />
                </div>
            )}
        </>
    );
}
