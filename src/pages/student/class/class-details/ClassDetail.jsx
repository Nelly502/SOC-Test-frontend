import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Button, Tabs, Modal } from 'antd';
import { FaDoorOpen } from 'react-icons/fa';
import { Quizzes } from './quizzes/Quizzes';
import { getClassById, leaveClass } from '../../../../requests/student/student-classes.request';

export function ClassDetail() {
    const [classInfo, setClassInfo] = useState({});

    const navigate = useNavigate();
    let { id, tab } = useParams();

    useEffect(() => {
        if (tab == null) {
            navigate('quizzes', { replace: true });
        }
    }, [tab]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getClassById(id);
            setClassInfo(data);
        };
        fetchData();
    }, []);

    const handleLeaveClass = () => {
        try {
            Modal.confirm({
                title: `Bạn có muốn rời lớp học này?`,
                cancelText: 'Hủy bỏ',
                okText: 'Xác nhận',
                okType: 'danger',
                onOk: async () => {
                    await leaveClass(id);
                    navigate('/student/classes');
                },
            });
        } catch (e) {
            //
        }
    };

    const tabItems = [
        {
            key: 'quizzes',
            label: `Danh sách quiz`,
            children: <Quizzes />,
        },
    ];

    return (
        <div className="mx-auto w-300 max-w-full flex-1 flex flex-col pb-6">
            {/* Header */}
            <div className="flex justify-between items-center ">
                <h3 className="md:text-4xl text-blue-900 ">{classInfo.name}</h3>
                <Button onClick={handleLeaveClass} icon={<FaDoorOpen />} className="flex jutify-center items-center">
                    &nbsp;Rời lớp
                </Button>
            </div>
            {/* Content */}
            <div className=" flex-1 mt-2 p-2 md:p-5 bg-white rounded form-shadow">
                <Tabs
                    activeKey={tab}
                    destroyInactiveTabPane
                    items={tabItems}
                    onChange={(key) => navigate(`/student/classes/${id}/${key}`, { replace: true })}
                />
            </div>
        </div>
    );
}
