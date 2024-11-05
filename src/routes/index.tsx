import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AppLayout } from "../layouts/AppLayout";
import { LoginPage } from "../pages/Login";
import { DashboardPage } from "@/pages/Dashoard";
import { LoadingOverlay } from "@mantine/core";
import Inbox from "@/pages/Inbox";

export const AppRoutes = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingOverlay visible={true} />;
    }

    return (
        <Routes>
            <Route
                path="/login"
                element={!user ? <LoginPage /> : <Navigate to="/dashboard" />}
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <DashboardPage />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/inbox"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <Inbox />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/"
                element={<Navigate to={user ? "/dashboard" : "/login"} />}
            />
        </Routes>
    );
};

// ProtectedRoute component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
};
