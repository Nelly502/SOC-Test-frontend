import { useEffect, useRef } from 'react';
import { Loading } from '../../../components/loading/Loading.jsx';
import { useNavigate, useParams } from 'react-router';
import { joinClass } from '../../../requests/student/student-classes.request.js';
import { message } from 'antd';

export function JoinClass() {
    const joined = useRef(false);

    const navigate = useNavigate();
    const { classNumber } = useParams();

    useEffect(() => {
        const join = async () => {
            try {
                await joinClass({ classNumber });
                message.success('Đã gửi yêu cầu vào lớp');
            } catch (e) {
                //
            } finally {
                navigate('/student/classes');
            }
        };
        if (!joined.current) {
            joined.current = true;
            join();
        }
    }, []);

    return <Loading />;
}
