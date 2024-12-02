import { EmailMetadata } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmailForm } from "./MetadataForm";
import EditCompany from "./EditCompany";

export default function EditEmail() {
	const { id } = useParams();
	const [emailData, setED] = useState<null | EmailMetadata>(null);
	const navigate = useNavigate();

	const fetchData = async () => {
		const data = await axios.get<EmailMetadata>(`/emails/${id}/get`);
		console.log(data.data);
		setED(data.data);
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleSubmit = (values: EmailMetadata) => {
		// Handle form submission here
		console.log("Form values:", values);
		// Make API call to save changes
	};

	function companyUpdateHandler(): void {
		// Refresh current page
		navigate(0);
	}

	if (id === undefined) {
		return <p>email id is not specified</p>;
	}

	return (
		<>
			{!emailData ? <p>Loading...</p> : (
				<div className="max-w-6xl mx-auto p-4">
					<EditCompany onUpdate={companyUpdateHandler} email_id={Number(id)} />

					<EmailForm
						initialData={emailData}
						onSubmit={handleSubmit}
					/>
				</div>
			)}
		</>
	);
}
