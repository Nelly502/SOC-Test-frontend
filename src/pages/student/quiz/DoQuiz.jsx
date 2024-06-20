import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Loading } from '../../../components/loading/Loading.jsx';
import { doQuiz, getQuizById } from '../../../requests/student/student-quizzes.request.js';
import { Button, Checkbox, Form, Input, Radio, Space } from 'antd';
import { getGeolocationPosition } from '../../../utils/geolocation.util.js';
import { AES } from 'crypto-js';
import { useSelector } from 'react-redux';

export function DoQuiz() {
    const [loading, setLoading] = useState(true);
    const [quiz, setQuiz] = useState();

    const { id } = useParams();
    const navigate = useNavigate();

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

    useEffect(() => {
        getData();
    }, [id]);

    const handleSubmit = () => {
        getData();
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) return <Loading />;
    if (!quiz) {
        return (
            <div className="flex-1 flex flex-col space-y-4 justify-center items-center">
                <p></p>
                <Button onClick={handleBack} type="primary">
                    Quay lại
                </Button>
            </div>
        );
    }
    if (quiz.studentAnswers[0]) {
        return (
            <div className="flex-1 flex flex-col space-y-4 justify-center items-center">
                <div>Bạn đã hoàn thành quiz này</div>
                <div>
                    Điểm số: {quiz.studentAnswers[0].correct} / {quiz.studentAnswers[0].total}
                </div>
                <Button onClick={handleBack} type="primary">
                    Quay lại
                </Button>
            </div>
        );
    }

    return <QuizForm quiz={quiz} onSubmit={handleSubmit} />;
}

const QuizForm = ({ quiz, onSubmit }) => {
    const [loading, setLoading] = useState(false);

    const { id } = useParams();
    const [form] = Form.useForm();
    const user = useSelector((state) => state.user);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const formData = await form.validateFields();
            const position = await getGeolocationPosition();
            const answers = [];
            const verify = AES.encrypt(
                JSON.stringify({ userId: user.id, ...position }),
                import.meta.env.VITE_QUIZ_ENCRYPT_KEY,
            ).toString();
            for (const questionId in formData) {
                if (typeof formData[questionId] === 'number') {
                    answers.push({ questionId: Number(questionId), answerId: formData[questionId] });
                } else if (typeof formData[questionId] === 'object') {
                    answers.push({ questionId: Number(questionId), answerIds: formData[questionId] });
                } else if (typeof formData[questionId] === 'string') {
                    answers.push({ questionId: Number(questionId), answer: formData[questionId] });
                }
            }
            const data = {
                position,
                answers,
                verify,
            };
            await doQuiz(id, data);
            onSubmit();
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <h1 className="md:text-4xl text-blue-900 text-center shadow-bottom mb-4">{quiz.name}</h1>
            <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                validateTrigger="onBlur"
                className="w-250 max-w-full form-shadow p-6"
                labelAlign="left"
            >
                {quiz.questions.map((q, i) => (
                    <Form.Item
                        key={i}
                        label={`Câu ${i + 1}: ${q.question}`}
                        name={q.questionId}
                        rules={[{ required: true, message: 'Hãy chọn đáp án' }]}
                    >
                        {(() => {
                            switch (q.type) {
                                case 1:
                                    return (
                                        <Radio.Group>
                                            <Space direction="vertical">
                                                {q.answers.map((a, j) => (
                                                    <Radio key={j} value={a.answerId}>
                                                        {a.label}
                                                    </Radio>
                                                ))}
                                            </Space>
                                        </Radio.Group>
                                    );
                                case 2:
                                    return (
                                        <Checkbox.Group>
                                            <Space direction="vertical">
                                                {q.answers.map((a, j) => (
                                                    <Checkbox key={j} value={a.answerId}>
                                                        {a.label}
                                                    </Checkbox>
                                                ))}
                                            </Space>
                                        </Checkbox.Group>
                                    );
                                case 3:
                                    return <Input placeholder="Nhập câu trả lời" />;
                                default:
                                    return <></>;
                            }
                        })()}
                    </Form.Item>
                ))}
                <div className="text-center">
                    <Button type="primary" loading={loading} htmlType="submit" onClick={handleSubmit} className="mr-1">
                        Nộp bài
                    </Button>
                </div>
            </Form>
        </div>
    );
};
