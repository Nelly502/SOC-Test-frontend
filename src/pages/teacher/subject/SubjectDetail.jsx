import { Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Loading } from '../../../components/loading/Loading.jsx';
import { Chapters } from './chapters/Chapters.jsx';
import { SubjectSetting } from './SubjectSetting.jsx';
import { getSubjectByIdTeacher } from '../../../requests/teacher/teacher-subjects.request.js';
import { CreateChapter } from './chapters/CreateChapter.jsx';

export function SubjectDetail() {
    const [subjectInfo, setSubjectInfo] = useState({});
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const { id, tab } = useParams();

    useEffect(() => {
        if (tab == null) {
            navigate('quizzes', { replace: true });
        }
    }, [tab]);

    const getData = async () => {
        try {
            setLoading(true);
            const data = await getSubjectByIdTeacher(id);
            setSubjectInfo(data);
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, [id]);

    const handleChangeSubjectInfo = async () => {
        return;
    };

    const tabItems = [
        {
            key: 'chapters',
            label: `Danh sách chương`,
            children: <Chapters />,
        },
        {
            key: 'create-chapter',
            label: 'Tạo chương mới',
            children: <CreateChapter />,
        },
        {
            key: 'settings',
            label: `Cài đặt`,
            children: <SubjectSetting subjectInfo={subjectInfo} onChangeClassInfo={handleChangeSubjectInfo} />,
        },
    ];

    if (loading) return <Loading />;

    return (
        <div className="flex-1 flex flex-col mx-auto w-300 max-w-full pb-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="md:text-4xl text-blue-900 ">{subjectInfo.name}</h3>
            </div>
            {/* Content */}
            <div className="flex-1 flex px-6 pb-6 mt-2 bg-white rounded form-shadow shadow-md">
                <Tabs
                    className="flex-1 max-w-full"
                    activeKey={tab}
                    destroyInactiveTabPane
                    items={tabItems}
                    onChange={(key) => navigate(`/teacher/subjects/${id}/${key}`, { replace: true })}
                />
            </div>
        </div>
    );
}
