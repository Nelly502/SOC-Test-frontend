import { Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { EditQuiz } from './EditQuiz.jsx';
import { getQuizById } from '../../../requests/teacher/teacher-quizzes.request.js';
import { StudentsAnswer } from './StudentAnswers.jsx';

export function QuizDetails() {
    const [loading, setLoading] = useState(false);
    const [quiz, setQuiz] = useState({});

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
        </div>
    );
}
