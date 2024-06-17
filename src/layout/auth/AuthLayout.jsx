import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

export const AuthLayout = ({ children }) => {
    const user = useSelector((state) => state.user);
    if (user) return <Navigate to="/" />;
    return <div className="auth-layout">{children}</div>;
};
