import { AppShell, Burger, Flex, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    IconDatabase,
    IconHistory,
    IconHourglassEmpty,
    IconLogout,
    IconMail,
    IconMailCancel,
    IconWriting,
} from "@tabler/icons-react";
import { Helmet } from "react-helmet";
import { useAuth } from "../context/AuthContext";
import NavbarItem from "@/components/ui/NavbarItem";
import { Notifications } from "@mantine/notifications";
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { IconChatGPT } from "@/CustomIcons/IconChatGPT";
import { IconAmazonScraper } from "@/CustomIcons/IconAmazonScraper";
import Requests from "@/functions/Requests";
import { API_URL } from "@/global";

interface Props {
    children: ReactNode;
    title: string;
}

export const AppLayout = ({ children, title }: Props) => {
    const [opened, { toggle }] = useDisclosure();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if backend token is valid
        Requests.get({
            url: "/check-token",
            error(_data) {
                window.location.href = `${API_URL}/auth/backend`;
            },
        });
    }, []);

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
            <Helmet>
                <title>{title}</title>
            </Helmet>

            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger opened={opened} onClick={toggle} size="sm" />
                        <h3 className="cursor-pointer select-none" onClick={() => navigate("/login")}>
                            Gmail app
                        </h3>
                    </Group>
                    <Group>
                        <span>{user?.name}</span>
                        <IconLogout style={{ cursor: "pointer" }} onClick={logout} />
                    </Group>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <Flex direction="column" gap={12}>
                    <NavbarItem link="/emails" icon={<IconMail />} text="Emails" />
                    <NavbarItem link="/unsubscribed/" icon={<IconMailCancel />} text="Unsubscribed emails" />
                    <NavbarItem link="/drafts/create" icon={<IconWriting />} text="Create drafts" />
                    <NavbarItem link="/drafts/queued" icon={<IconHourglassEmpty />} text="Queued drafts" />
                    <NavbarItem link="/data" icon={<IconDatabase />} text="Sync" />
                    <NavbarItem link="/actions/history" icon={<IconHistory />} text="See action history" />
                    <NavbarItem link="/chatgpt" icon={<IconChatGPT />} text="ChatGPT Analysis" />
                    <NavbarItem link="/amazon-scraper" icon={<IconAmazonScraper />} text="Amazon Scraper" />
                </Flex>
            </AppShell.Navbar>
            <AppShell.Main>
                <Notifications />
                {children}
            </AppShell.Main>
        </AppShell>
    );
};
