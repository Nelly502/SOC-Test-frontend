import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { Members } from './members/Members';
import { Quizzes } from './quizzes/Quizzes';
import { ClassSetting } from './settings/ClassSetting';
import { getClassByID } from '../../../../requests/teacher/teacher-classes.request';
import { Loading } from '../../../../components/loading/Loading.jsx';

export function ClassDetail() {
    const [loading, setLoading] = useState(true);
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
            try {
                setLoading(true);
                const data = await getClassByID(id).catch((error) => console.log(error));
                setClassInfo(data);
            } catch (e) {
                //
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const onChangeClassInfo = (newClassInfo) => {
        setClassInfo(newClassInfo);
    };

    const tabItems = [
        {
            key: 'quizzes',
            label: `Danh sách quiz`,
            children: <Quizzes />,
        },
        {
            key: 'members',
            label: `Danh sách thành viên`,
            children: <Members />,
        },
        {
            key: 'settings',
            label: `Cài đặt`,
            children: <ClassSetting classInfo={classInfo} onChangeClassInfo={onChangeClassInfo} />,
        },
    ];

    if (loading) return <Loading />;

    return (
        <div className="flex-1 flex flex-col mx-auto w-300 max-w-full pb-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="md:text-4xl text-blue-900 ">{classInfo.name}</h3>
            </div>
            {/* Content */}
            <div className="flex-1 flex px-6 pb-6 mt-2 bg-white rounded form-shadow shadow-md">
                <Tabs
                    className="flex-1 max-w-full"
                    activeKey={tab}
                    destroyInactiveTabPane
                    items={tabItems}
                    onChange={(key) => navigate(`/teacher/classes/${id}/${key}`, { replace: true })}
                />
            </div>
        </div>
    );
}
