// src/pages/Login.tsx
import { API_URL } from "@/global";
import { Paper, Title, Container, Button, Text, Stack } from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons-react";

export function LoginPage() {
    const handleGoogleLogin = () => {
        window.location.href = API_URL + "/auth/google";
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center">Welcome back!</Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Sign in with your Google account to continue
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Stack>
                    <Button
                        leftSection={<IconBrandGoogle size={18} />}
                        variant="default"
                        onClick={handleGoogleLogin}
                    >
                        Continue with Google
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
}
