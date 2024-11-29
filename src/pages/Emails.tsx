import { EmailSearch } from "@/types";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Input, Table, Title } from "@mantine/core";
import classNames from "classnames";
import useWindowSize from "@/hooks/useWindowSize";

export default function Emails() {
	const [list, setList] = useState<EmailSearch[]>([]);
	const firstRender = useRef(true);

	const fetchList = async () => {
		const tmp = await axios.get<EmailSearch[]>("/emails/list", { params: { search: searchQuery } });
		setList(tmp.data);
	};

	useEffect(() => {
		fetchList().catch(console.error)
			.finally(() => {
				firstRender.current = false;
			});
	}, []);

	const [searchQuery, setSQ] = useState<string>("");
	useEffect(() => {
		if (firstRender.current) return;

		const t = setTimeout(() => {
			fetchList();
		}, 1000);

		return () => {
			clearTimeout(t);
		};
	}, [searchQuery]);

	return (
		<>
			<Title>Email list</Title>
			<Input.Wrapper label="Search input" my={16}>
				<Input placeholder="Search email, company and person name" onChange={(e) => setSQ(e.target.value)} />
			</Input.Wrapper>

			<Table className="email-table-list">
				<Table.Tr>
					<Table.Th>Person name</Table.Th>
					<Table.Th>Email address</Table.Th>
					<Table.Th>Company name</Table.Th>
				</Table.Tr>

				{list.map((item, idx) => (
					<Table.Tr key={idx}>
						<Table.Td
							className={classNames({
								"text-gray-300 italic": item.person_name === null ? true : false,
							})}
						>
							{(item.person_name) ? item.person_name : "No name"}
						</Table.Td>
						<Table.Td className="info-container">
							<div className="info">{item.email}</div>
						</Table.Td>
						<Table.Td className="info-container">
							<div className="info">{item.company_name}</div>
						</Table.Td>
					</Table.Tr>
				))}
			</Table>
		</>
	);
}
