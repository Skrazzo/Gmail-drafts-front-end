import { DraftForm } from "@/types";
import { Input, Paper, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import RichEditor from "../RichEditor";

interface EmailContent {
	form: UseFormReturnType<DraftForm>;
}

export default function EmailContent(props: EmailContent) {
	return (
		<>
			<Paper withBorder p="md" mt={16}>
				<Text fw={700}>Email content</Text>
				<Input
					mt={8}
					placeholder="Email subject"
					{...props.form.getInputProps("subject")}
				/>

				<RichEditor value="<p>HEllo world</p>" onChange={console.log} />
			</Paper>
		</>
	);
}
