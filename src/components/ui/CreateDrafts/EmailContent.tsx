import { DraftForm } from "@/types";
import { Input, Paper, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import RichEditor from "../RichEditor";
import { ReactElement } from "react";
import FileSelect from "../FileSelect";

interface EmailContentProps {
	form: UseFormReturnType<DraftForm>;
}

export default function EmailContent(props: EmailContentProps): ReactElement {
	function richChangeHandler(html: string) {
		props.form.setValues({ body: html });
	}

	return (
		<>
			<Paper withBorder p="md" mt={16}>
				<Text fw={700}>Email content</Text>
				<Input
					my={8}
					placeholder="Email subject"
					{...props.form.getInputProps("subject")}
				/>

				<RichEditor initialValue={props.form.values.body} onChange={richChangeHandler} />
				<FileSelect
					value={props.form.values.attachments}
					onChange={(files) => props.form.setValues({ attachments: files })}
					my={8}
					label=""
					placeholder="Click here to add attachments"
					multiple
				/>
			</Paper>
		</>
	);
}
