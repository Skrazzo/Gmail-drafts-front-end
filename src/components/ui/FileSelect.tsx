import { FileInput, FileInputProps, Pill } from "@mantine/core";

const ValueComponent: FileInputProps["valueComponent"] = ({ value }) => {
	if (value === null) {
		return null;
	}

	if (Array.isArray(value)) {
		return (
			<Pill.Group>
				{value.map((file, index) => <Pill key={index}>{file.name}</Pill>)}
			</Pill.Group>
		);
	}

	return <Pill>{value.name}</Pill>;
};

interface FileSelectProps {
	value: File | File[] | null;
	my?: number;
	label: string;
	placeholder: string;
	multiple: boolean;
	onChange: (files: File | File[] | null) => void;
}

export default function FileSelect(props: FileSelectProps) {
	return (
		<FileInput
			label={props.label}
			placeholder={props.placeholder}
			multiple={props.multiple}
			clearable
			valueComponent={ValueComponent}
			my={props.my}
			onChange={props.onChange}
		/>
	);
}
