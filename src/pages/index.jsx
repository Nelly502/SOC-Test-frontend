import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router';
import { AuthLayout } from '../layout/auth/AuthLayout.jsx';
import { useEffect, useState } from 'react';
import { updateUser } from '../redux/slices/user.slice.js';
import { Loading } from '../components/loading/Loading.jsx';
import { refreshAccessToken } from '../requests/auth.request.js';
import { Error404 } from '../components/error-pages/Error404.jsx';
import { Error403 } from '../components/error-pages/Error403.jsx';
import { LoginPage } from './auth/Login.jsx';
import { Logout } from './auth/Logout.jsx';
import { Register } from './auth/Register.jsx';
import { ForgotPassWord } from './auth/ForgotPassword.jsx';
import { Profile } from './profile/index.jsx';
import { getConstants } from '../requests/config.request.js';
import { updateConfig } from '../redux/slices/config.slice.js';
import { AppLayout } from '../layout/app/AppLayout.jsx';
import { ListClasses as ListClassesTeacher } from './teacher/class/ListClasses.jsx';
import { CreateClass } from './teacher/class/CreateClass.jsx';
import { ClassDetail as ClassDetailTeacher } from './teacher/class/class-details/ClassDetail.jsx';
import { ListClasses as ListClassesStudent } from './student/class/ListClasses.jsx';
import { ClassDetail as ClassDetailStudent } from './student/class/class-details/ClassDetail.jsx';
import { QuizDetails } from './teacher/quiz/QuizDetails.jsx';
import { DoQuiz } from './student/quiz/DoQuiz.jsx';
import { CreateQuiz } from './teacher/class/class-details/quizzes/CreateQuizz.jsx';
import { JoinClass } from './student/class/JoinClass.jsx';
import { stringify } from 'qs';
import { ListMembers } from './admin/ListMembers.jsx';

const ProtectedRoute = ({ role, redirectPath, children }) => {
    const user = useSelector((state) => state.user);
    const location = useLocation();

    if (user) {
        if (!role || user.role === role) return children;
        return <Navigate to="/403" />;
    }

    return (
        <Navigate
            to={{
                pathname: redirectPath,
                search: stringify({
                    redirect: encodeURIComponent(location.pathname + location.search),
                }),
            }}
        />
    );
};

const HomeNavigate = () => {
    const user = useSelector((state) => state.user);

    if (user?.role === 1) return <Navigate to="/teacher/classes" />;
    if (user?.role === 2) return <Navigate to="/student/classes" />;
    if (user?.role === 3) return <Navigate to="/admin/members" />;

    return <Navigate to="/auth/login" />;
};

export const AppRoutes = () => {
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const constants = await getConstants();
            dispatch(updateConfig({ ...constants }));

            const data = await refreshAccessToken();
            dispatch(updateUser(data.user));
        } catch (err) {
            //
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <Routes>
            {/* error pages */}
            <Route path="/*" element={<Error404 />} />
            <Route path="/403" element={<Error403 />} />
            <Route path="/logout" element={<Logout />} />

            {/* auth routes */}
            <Route
                path="/auth"
                element={
                    <AuthLayout>
                        <Outlet />
                    </AuthLayout>
                }
            >
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassWord />} />
            </Route>
            <Route path="/" element={<HomeNavigate />} />

            {/* Protected routes */}
            <Route
                element={
                    <ProtectedRoute redirectPath="/auth/login">
                        <Outlet />
                    </ProtectedRoute>
                }
            >
                <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Teacher routes */}
            <Route
                element={
                    <ProtectedRoute role={1} redirectPath="/auth/login">
                        <AppLayout>
                            <Outlet />
                        </AppLayout>
                    </ProtectedRoute>
                }
            >
                <Route path="/teacher/classes" element={<ListClassesTeacher />} />
                <Route path="/teacher/classes/create" element={<CreateClass />} />
                <Route path="/teacher/classes/:id" element={<ClassDetailTeacher />} />
                <Route path="/teacher/classes/:id/:tab" element={<ClassDetailTeacher />} />
                <Route path="/teacher/classes/:id/quizzes/create" element={<CreateQuiz />} />
                <Route path="/teacher/quizzes/:id" element={<QuizDetails />} />
                <Route path="/teacher/quizzes/:id/:tab" element={<QuizDetails />} />
            </Route>

            {/* Students routes */}
            <Route
                element={
                    <ProtectedRoute role={2} redirectPath="/auth/login">
                        <AppLayout>
                            <Outlet />
                        </AppLayout>
                    </ProtectedRoute>
                }
            >
                <Route path="/student/classes" element={<ListClassesStudent />} />
                <Route path="/student/classes/join/:classNumber" element={<JoinClass />} />
                <Route path="/student/classes/:id" element={<ClassDetailStudent />} />
                <Route path="/student/classes/:id/:tab" element={<ClassDetailStudent />} />
                <Route path="/student/quizzes/:id" element={<DoQuiz />} />
            </Route>

            {/* Admins routes */}
            <Route
                element={
                    <ProtectedRoute role={3} redirectPath="/auth/login">
                        <AppLayout>
                            <Outlet />
                        </AppLayout>
                    </ProtectedRoute>
                }
            >
                <Route path="admin/members" element={<ListMembers />} />
            </Route>
        </Routes>
    );
};
