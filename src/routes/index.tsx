import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AppLayout } from "../layouts/AppLayout";
import { LoginPage } from "../pages/Login";
import { LoadingOverlay } from "@mantine/core";
import Emails from "@/pages/Emails";
import EditEmail from "@/pages/Email/EditEmailPage";
import CreateDrafts from "@/pages/CreateDrafts";
import QueueDrafts from "@/pages/QueueDrafts";
import SyncPage from "@/pages/SyncPage";

export const AppRoutes = () => {
	const { user, loading } = useAuth();

	if (loading) {
		return <LoadingOverlay visible={true} />;
	}

	return (
		<Routes>
			<Route
				path="/login"
				element={!user ? <LoginPage /> : <Navigate to="/emails" />}
			/>
			<Route
				path="/emails"
				element={
					<ProtectedRoute>
						<AppLayout>
							{/* <DashboardPage /> */}
							<Emails />
						</AppLayout>
					</ProtectedRoute>
				}
			/>

			<Route
				path="/email/:id/"
				element={
					<ProtectedRoute>
						<AppLayout>
							<EditEmail />
						</AppLayout>
					</ProtectedRoute>
				}
			/>

			<Route
				path="/drafts/create/"
				element={
					<ProtectedRoute>
						<AppLayout>
							<CreateDrafts />
						</AppLayout>
					</ProtectedRoute>
				}
			/>

			<Route
				path="/drafts/queued/"
				element={
					<ProtectedRoute>
						<AppLayout>
							<QueueDrafts />
						</AppLayout>
					</ProtectedRoute>
				}
			/>

			<Route
				path="/data/"
				element={
					<ProtectedRoute>
						<AppLayout>
							<SyncPage />
						</AppLayout>
					</ProtectedRoute>
				}
			/>
			{
				/* <Route
                path="/inbox"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <Inbox />
                        </AppLayout>
                    </ProtectedRoute>
                }
            /> */
			}
			{
				/* <Route
                path="/sent"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <Sent />
                        </AppLayout>
                    </ProtectedRoute>
                }
            /> */
			}
			<Route
				path="/"
				element={<Navigate to={user ? "/emails" : "/login"} />}
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
