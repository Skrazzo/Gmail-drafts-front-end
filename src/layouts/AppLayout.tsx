import { AppShell, Burger, Flex, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconHourglassEmpty, IconLogout, IconMail, IconWriting } from "@tabler/icons-react";

import { useAuth } from "../context/AuthContext";
import NavbarItem from "@/components/ui/NavbarItem";

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [opened, { toggle }] = useDisclosure();
	const { user, logout } = useAuth();

	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{
				width: 300,
				breakpoint: "sm",
				collapsed: { mobile: !opened },
			}}
			padding="md"
		>
			<AppShell.Header>
				<Group h="100%" px="md" justify="space-between">
					<Group>
						<Burger opened={opened} onClick={toggle} size="sm" />
						<h3>Gmail app</h3>
					</Group>
					<Group>
						<span>{user?.name}</span>
						<IconLogout
							style={{ cursor: "pointer" }}
							onClick={logout}
						/>
					</Group>
				</Group>
			</AppShell.Header>
			<AppShell.Navbar p="md">
				<Flex direction="column" gap={12}>
					{
						/* <NavbarItem
                        link="/dashboard"
                        icon={<IconLayoutDashboard />}
                        text="Dashboard"
                    /> */
					}
					<NavbarItem
						link="/emails"
						icon={<IconMail />}
						text="Emails"
					/>
					<NavbarItem
						link="/drafts/create"
						icon={<IconWriting />}
						text="Create drafts"
					/>
					<NavbarItem
						link="/drafts/queued"
						icon={<IconHourglassEmpty />}
						text="Queued drafts"
					/>
					{
						/* <NavbarItem
                        link="/inbox"
                        icon={<IconMail />}
                        text="Inbox"
                    />
                    <NavbarItem
                        link="/sent"
                        icon={<IconSend />}
                        text="Sent emails"
                    /> */
					}
				</Flex>
			</AppShell.Navbar>
			<AppShell.Main>{children}</AppShell.Main>
		</AppShell>
	);
};
