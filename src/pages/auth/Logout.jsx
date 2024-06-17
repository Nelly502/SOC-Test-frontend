import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { removeUser } from '../../redux/slices/user.slice.js';
import { removeAccessToken } from '../../utils/token.util.js';

export const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        removeAccessToken();
        dispatch(removeUser());
        navigate('/auth/login');
    }, []);

    return <></>;
};
