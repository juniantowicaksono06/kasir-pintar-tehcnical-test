import React from 'react';
import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import RootLayout from "@/layouts/RootLayout";
import RouteLoading from "@/components/RouteLoading";
import Error404 from "@/components/404";
import UnprotectedRoute from './UnprotectedRoute';
import LoadingProvider from "@/providers/LoadingProvider";

const Home = React.lazy(() => import('@/pages/Home'));
const CreateReimbursement = React.lazy(() => import('@/pages/CreateReimbursement'));
const Login = React.lazy(() => import('@/pages/Login'));
const Register = React.lazy(() => import('@/pages/Register'));
const Users = React.lazy(() => import('@/pages/Users'));
const AddUser = React.lazy(() => import('@/pages/AddUser'));
const EditUser = React.lazy(() => import('@/pages/EditUser'));
import ProtectedRoute from './ProtectedRoute';
import ProfileProvider from './providers/UserProfileProvider';
import Reimbursement from './pages/Reimbursement';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path="/"
            element={
                <ProfileProvider>
                    <LoadingProvider>
                        <RootLayout />
                    </LoadingProvider>
                </ProfileProvider>
            }
        >
            <Route
                index
                element={
                    <React.Suspense fallback={<RouteLoading />}>
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    </React.Suspense>
                }
            />
            <Route
                path="/create-reimbursement"
                element={
                    <React.Suspense fallback={<RouteLoading />}>
                        <ProtectedRoute>
                            <CreateReimbursement />
                        </ProtectedRoute>
                    </React.Suspense>
                }
            />
            <Route
                path="/reimbursement"
                element={
                    <React.Suspense fallback={<RouteLoading />}>
                        <ProtectedRoute>
                            <Reimbursement />
                        </ProtectedRoute>
                    </React.Suspense>
                }
            />
            <Route
                path="/users"
                element={
                    <React.Suspense fallback={<RouteLoading />}>
                        <ProtectedRoute>
                            <Users />
                        </ProtectedRoute>
                    </React.Suspense>
                }
            />
            <Route
                path="/users/create"
                element={
                    <React.Suspense fallback={<RouteLoading />}>
                        <ProtectedRoute>
                            <AddUser />
                        </ProtectedRoute>
                    </React.Suspense>
                }
            />
            <Route
                path="/users/:id"
                element={
                    <React.Suspense fallback={<RouteLoading />}>
                        <ProtectedRoute>
                            <EditUser />
                        </ProtectedRoute>
                    </React.Suspense>
                }
            />
            <Route
                path="/login"
                element={
                    <React.Suspense fallback={<RouteLoading />}>
                        <UnprotectedRoute>
                            <Login />
                        </UnprotectedRoute>
                    </React.Suspense>
                }
            />
            <Route
                path="/register"
                element={
                    <React.Suspense fallback={<RouteLoading />}>
                        <UnprotectedRoute>
                            <Register />
                        </UnprotectedRoute>
                    </React.Suspense>
                }
            />
            <Route
                path="*"
                element={<Error404 />}
            />
        </Route>
    )
);

export default router;
