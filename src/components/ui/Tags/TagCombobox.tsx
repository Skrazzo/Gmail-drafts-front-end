import { AxiosResponse, Tag } from "@/types";
import {
	Combobox,
	Group,
	Highlight,
	Loader,
	Paper,
	Pill,
	PillsInput,
	Text,
	useCombobox
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useEffect, useState } from "react";

interface TagComboboxProps {
	form: UseFormReturnType<any>;
}

export default function TagCombobox({ form }: TagComboboxProps) {
	const combobox = useCombobox({
		onDropdownClose: () => combobox.resetSelectedOption(),
		onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
	});

	const [allTags, setAllTags] = useState<Tag[]>([]);
	const [search, setSearch] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const fetchTags = async () => {
		setLoading(true);
		const tags = (await axios.get<AxiosResponse<Tag[]>>("/tags/get")).data;
		if (!tags.success) {
			notifications.show({
				title: "Error",
				message: "while fetching all tags: " + tags.error,
				color: "red",
			});
			console.error(tags.error);
			return;
		}

		setAllTags(tags.data);
		setLoading(false);
	};

	useEffect(() => {
		fetchTags();
	}, []);

	// Tag manipulation functions
	const handleValueSelect = (val: string) => {
		if (val === "$create") {
			createTag(search);
		}

		setSearch("");
	};

	const createTag = async (tagName: string) => {
		const createRes =
			(await axios.post<AxiosResponse<Tag>>("/tags/create", null, { params: { name: tagName } })).data;

		if (!createRes.success) {
			notifications.show({
				title: "Error",
				message: "Error while updating tags, just refresh page bro " + createRes.error,
				color: "red",
			});
			return;
		}

		await fetchTags();

		// add new tag
		handleTagAdd(createRes.data.id);
	};

	const getTagName = (id: number): string => {
		const match = allTags.filter((tag) => tag.id === id);
		if (match.length > 0) {
			return match[0].name;
		} else {
			return "Icorrect id";
		}
	};

	const tagExists = (name: string): boolean => {
		const filtered = allTags.filter((tag) => tag.name.toLowerCase() === name.toLowerCase());
		return filtered.length === 0 ? false : true;
	};

	const handleValueRemove = (tagId: number) => {
		const currentTags = form.values.tags;
		form.setValues({ tags: currentTags.filter((id: number) => id !== tagId) });
	};

	const handleTagAdd = (tagId: number) => {
		const currentTags = form.values.tags;
		if (currentTags.includes(tagId)) { // Check if tag is already added
			return;
		}

		form.setValues({ tags: [...currentTags, tagId] });
	};

	// Values are selected values that user has selected
	let values;
	if (form.values.tags) {
		values = form.values.tags.map((tagId: number) => (
			<Pill
				key={tagId}
				withRemoveButton
				onRemove={() => handleValueRemove(tagId)}
			>
				{getTagName(tagId)}
			</Pill>
		));
	}

	// Options are available options that user can click
	let options;
	if (form.values.tags !== null || form.values.tags !== undefined) {
		options = allTags
			.filter((tag) => !form.values.tags.includes(tag.id))
			.filter((tag) => tag.name.toLowerCase().includes(search.toLowerCase()))
			.map((tag) => (
				<Combobox.Option
					value={tag.id.toString()}
					key={tag.name}
					onClick={() => handleTagAdd(tag.id)}
				>
					<Group gap="sm">
						<Highlight highlight={search}>
							{tag.name}
						</Highlight>
					</Group>
				</Combobox.Option>
			));
	}

	return (
		<div>
			<Text>Tags</Text>
			<Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
				{loading
					? (
						<Paper withBorder h={36}>
							<Loader size={20} m={7} />
						</Paper>
					)
					: (
						<Combobox.DropdownTarget>
							<PillsInput onClick={() => combobox.openDropdown()}>
								<Pill.Group>
									{values}

									<Combobox.EventsTarget>
										<PillsInput.Field
											onFocus={() => combobox.openDropdown()}
											onBlur={() => combobox.closeDropdown()}
											value={search}
											placeholder="Search values"
											onChange={(event) => {
												combobox.updateSelectedOptionIndex();
												setSearch(event.currentTarget.value);
											}}
											onKeyDown={(event) => {
												const currentTags = form.values.tags;

												if (event.key === "Backspace" && search.length === 0) {
													event.preventDefault();
													handleValueRemove(currentTags[currentTags.length - 1]);
												}
											}}
										/>
									</Combobox.EventsTarget>
								</Pill.Group>
							</PillsInput>
						</Combobox.DropdownTarget>
					)}

				{options &&
					(
						<Combobox.Dropdown>
							<Combobox.Options>
								{options}

								{/* Could not find with the search */}
								{(search.length !== 0 && !tagExists(search)) && (
									<Combobox.Option value="$create">+ Create {search}</Combobox.Option>
								)}

								{/* {exactOptionMatch && search.trim().length > 0 && options.length === 0 && ( */}
								{(options.length === 0 && search.length === 0) && (
									<Combobox.Empty>Nothing found</Combobox.Empty>
								)}
							</Combobox.Options>
						</Combobox.Dropdown>
					)}
			</Combobox>
		</div>
	);
}
