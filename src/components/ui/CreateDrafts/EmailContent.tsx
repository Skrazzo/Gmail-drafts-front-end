import { DraftForm } from "@/types";
import { Input } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import React from "react";

interface EmailContent {
	form: UseFormReturnType<DraftForm>;
}

export default function EmailContent(props: EmailContent) {
	return (
		<>
			<Input {...props.form.getInputProps("subject")} />
		</>
	);
}
