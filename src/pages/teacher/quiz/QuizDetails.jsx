import { Modal, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { EditQuiz } from './EditQuiz.jsx';
import { getQuizById } from '../../../requests/teacher/teacher-quizzes.request.js';
import { StudentsAnswer } from './StudentAnswers.jsx';
import QRCode from 'react-qr-code';
import { BsQrCode } from 'react-icons/bs';

export function QuizDetails() {
    const [loading, setLoading] = useState(false);
    const [quiz, setQuiz] = useState({});
    const [openQrModal, setOpenQrModal] = useState(false);

    const navigate = useNavigate();
    const { id, tab } = useParams();

    useEffect(() => {
        if (tab == null) {
            navigate('edit', { replace: true });
        }
    }, [tab]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            setLoading(true);
            const data = await getQuizById(id);
            setQuiz(data);
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = () => {
        getData();
    };

    const showQrCode = () => {
        setOpenQrModal(true);
    };

    const closeQrCode = () => {
        setOpenQrModal(false);
    };

    const tabItems = [
        {
            key: 'edit',
            label: 'Quiz',
            children: <EditQuiz quiz={quiz} onUpdate={handleUpdate} loading={loading} />,
        },
        {
            key: 'responses',
            label: 'Bài nộp',
            children: <StudentsAnswer studentAnswers={quiz?.studentAnswers} />,
        },
    ];

    return (
        <div className="flex-1 flex flex-col m-auto w-300 max-w-full pb-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="md:text-4xl text-blue-900 ">{quiz.name}</h3>
                <a onClick={showQrCode} className="whitespace-nowrap">
                    Mã QR làm bài
                    <BsQrCode className="ml-2" />
                </a>
            </div>
            {/* Content */}
            <div className="flex-1 flex mt-2 p-2 md:p-5 bg-white rounded form-shadow">
                <Tabs
                    className="flex-1 max-w-full"
                    activeKey={tab}
                    destroyInactiveTabPane
                    items={tabItems}
                    onChange={(key) => navigate(`/teacher/quizzes/${id}/${key}`, { replace: true })}
                />
            </div>

            <Modal
                className="qr-modal top-[10vh]"
                open={openQrModal}
                title="Quét mã QR để làm bài"
                width="fit-content"
                closable
                onCancel={closeQrCode}
            >
                <QRCode
                    className="w-[70vh] max-w-full h-[70vh]"
                    value={`${import.meta.env.VITE_APP_URL}/student/quizzes/${quiz.id}`}
                />
            </Modal>
        </div>
    );
}
