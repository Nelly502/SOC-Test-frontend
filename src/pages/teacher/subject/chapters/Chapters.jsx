import { Modal, Tabs } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Questions } from '../questions/Questions';
import { deleteChapter, getListChaptersTeacher } from '../../../../requests/teacher/teacher-chapters.request';
import { Loading } from '../../../../components/loading/Loading';
import './style.scss';

export const Chapters = () => {
    const [loading, setLoading] = useState(true);
    const [chapters, setChapters] = useState([]);

    const { id } = useParams();

    const getData = async () => {
        try {
            setLoading(true);
            const data = await getListChaptersTeacher({ subjectId: id });
            setChapters(data.records);
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, [id]);

    const handleEdit = (id, action) => {
        if (action === 'remove') {
            Modal.confirm({
                title: `Bạn có muốn xóa chương này khỏi môn học?`,
                cancelText: 'Hủy bỏ',
                okText: 'Xác nhận',
                okType: 'danger',
                onOk: async () => {
                    try {
                        setLoading(true);
                        await deleteChapter(id);
                        await getData();
                    } catch (e) {
                        //
                    } finally {
                        setLoading(false);
                    }
                },
            });
        }
    };

    const renderChapters = useMemo(() => {
        return chapters.map((chapter) => ({
            label: <span title={chapter.title}>{chapter.title}</span>,
            key: chapter.id,
            children: <Questions chapterInfo={chapter} onUpdateChapter={() => getData()} />,
        }));
    }, [chapters]);

    if (loading) return <Loading />;

    return (
        <div className="h-full chapters-tabs">
            <Tabs
                className="h-full hidden md:flex"
                destroyInactiveTabPane
                tabPosition="left"
                items={renderChapters}
                type="editable-card"
                hideAdd
                onEdit={handleEdit}
            />
            <Tabs
                className="h-full md:hidden"
                destroyInactiveTabPane
                items={renderChapters}
                type="editable-card"
                hideAdd
                onEdit={handleEdit}
            />
        </div>
    );
};
