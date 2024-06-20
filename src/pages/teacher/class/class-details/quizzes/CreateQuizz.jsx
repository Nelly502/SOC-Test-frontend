import { Button, Form, Input, Switch, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';
import { DateInput } from '../../../../../components/inputs/DateInput.jsx';
import { QuestionsInput } from '../../../../../components/inputs/QuestionsInput.jsx';
import { createQuiz } from '../../../../../requests/teacher/teacher-quizzes.request.js';
import logo from '../../../../../assets/images/logo.png';

export function CreateQuiz() {
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id: classId } = useParams();

    const handleFinish = async () => {
        try {
            setLoading(true);

            const { questionsKeys, ...data } = await form.validateFields();

            data.questions = questionsKeys.questions;
            data.keys = questionsKeys.keys;
            data.classId = Number(classId);

            const { id } = await createQuiz(data);
            message.success('Tạo quiz thành công');
            navigate(`/teacher/quizzes/${id}`, { replace: true });
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        navigate(`/teacher/classes/${classId}/quizzes`);
    };

    return (
        <div className="flex flex-col justify-center items-center p-6">
            <Form
                layout="horizontal"
                form={form}
                validateTrigger="onBlur"
                requiredMark={false}
                className="md:w-250 w-full form-shadow p-6"
                labelAlign="left"
                labelCol={{ span: 24, md: 4 }}
                wrapperCol={{ span: 24, md: 20 }}
                initialValues={{
                    open: false,
                }}
            >
                <div className="relative m-auto text-center">
                    <CloseOutlined
                        className={`md:text-base hover:text-red-500 absolute right-0 top-0 cursor-pointer z-100`}
                        onClick={handleCancel}
                    />
                    <img
                        src={logo}
                        className="w-2/3 md:min-h-22 min-h-12 sm:object-cover object-contain relative shadow-bottom"
                        style={{ zIndex: -1 }}
                    ></img>
                </div>
                <h1 className="md:text-4xl text-blue-900 text-center shadow-bottom mb-4">Tạo quiz</h1>
                <Form.Item label="Tên" name="name" rules={[{ required: true, message: 'Nhập tên quiz' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Mở quiz" name="open" valuePropName="checked">
                    <Switch className="ml-1 text-left" />
                </Form.Item>
                <Form.Item label="Thời gian đóng" name="closeTime">
                    <DateInput placeholder="Thời gian đóng" />
                </Form.Item>
                <Form.Item label="Câu hỏi" name="questionsKeys">
                    <QuestionsInput />
                </Form.Item>
                <div className="text-center">
                    <Button className="mr-1" type="primary" loading={loading} onClick={handleFinish}>
                        Tạo
                    </Button>
                    <Button className="ml-1" htmlType="reset" onClick={handleCancel}>
                        Hủy
                    </Button>
                </div>
            </Form>
        </div>
    );
}
