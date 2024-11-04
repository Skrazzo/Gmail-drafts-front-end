// src/pages/Dashboard.tsx
import { Container, Title, Text } from "@mantine/core";
import { useAuth } from "../context/AuthContext";

export function DashboardPage() {
    const { user } = useAuth();

    return (
        <Container size="lg">
            <Title order={2}>Dashboard</Title>
            <Text mt="md">Welcome back, {user?.name}!</Text>
        </Container>
    );
}
