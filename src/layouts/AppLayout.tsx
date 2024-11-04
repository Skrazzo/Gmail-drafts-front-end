import { AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLogout } from "@tabler/icons-react";

import { useAuth } from "../context/AuthContext";

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
                        <h3>My App</h3>
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
                {/* Add your navigation items here */}
            </AppShell.Navbar>
            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
};
