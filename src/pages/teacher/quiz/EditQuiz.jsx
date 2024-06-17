import { Button, Form, Input, Switch, message } from 'antd';
import { useEffect, useState } from 'react';
import { getGeolocationPosition } from '../../../utils/geolocation.util.js';
import { updateQuiz } from '../../../requests/teacher/teacher-quizzes.request.js';
import { DateInput } from '../../../components/inputs/DateInput.jsx';
import { QuestionsInput } from '../../../components/inputs/QuestionsInput.jsx';

export function EditQuiz({ quiz, onUpdate }) {
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();

    useEffect(() => {
        handleReset(quiz);
    }, [quiz]);

    const handleFinish = async () => {
        try {
            setLoading(true);

            const { questionsKeys, ...data } = await form.validateFields();
            if (data.open) {
                data.position = await getGeolocationPosition();
            }
            data.questions = questionsKeys.questions;
            data.keys = questionsKeys.keys;
            delete data.classId;

            await updateQuiz(quiz.id, data);
            message.success('Cập nhật thành công');
            onUpdate();
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
    };

    const handleReset = (data) => {
        const { questions = [], key, ...quiz } = data;
        form.setFieldsValue({
            ...quiz,
            questionsKeys: {
                questions,
                keys: key?.keys || [],
            },
        });
    };
    return (
        <Form
            layout="horizontal"
            form={form}
            validateTrigger="onBlur"
            requiredMark={false}
            className=""
            labelAlign="left"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
        >
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
                <Button type="primary" loading={loading} onClick={handleFinish} className="mr-1">
                    Lưu
                </Button>
                <Button htmlType="reset" className="ml-1" onClick={handleReset}>
                    Hủy
                </Button>
            </div>
        </Form>
    );
}
