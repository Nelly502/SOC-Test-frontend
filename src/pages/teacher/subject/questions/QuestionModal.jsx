import { Form, Modal, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { createQuestion, updateQuestion } from '../../../../requests/teacher/teacher-questions.request';
import { getListChaptersTeacher } from '../../../../requests/teacher/teacher-chapters.request';
import { QuestionInput } from '../../../../components/inputs/QuestionsInput';

export const QuestionModal = ({ open, questionInfo, onCancel, onSaved }) => {
    const [loading, setLoading] = useState(false);
    const [chapterOptions, setChapterOptions] = useState([]);

    const [form] = Form.useForm();
    const { id: subjectId } = useParams();

    const getChapters = async () => {
        try {
            setLoading(true);
            const data = await getListChaptersTeacher({ subjectId });
            setChapterOptions(data.records.map((e) => ({ ...e, value: e.id, label: e.title })));
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getChapters();
    }, [subjectId]);

    useEffect(() => {
        if (questionInfo) {
            const { question, key, ...data } = questionInfo;
            form.setFieldsValue({
                ...data,
                questionsKeys: { question, key },
            });
        }
    }, [questionInfo]);

    const handleFinish = async () => {
        try {
            setLoading(true);

            const { questionsKeys, ...data } = await form.validateFields();

            data.question = questionsKeys.question;
            data.key = questionsKeys.key;

            if (questionInfo?.id) {
                await updateQuestion(questionInfo?.id, data);
                message.success('Cập nhật câu hỏi thành công');
            } else {
                await createQuestion(data);
                message.success('Tạo câu hỏi thành công');
            }
            onCancel();
            onSaved();
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            open={open}
            title="Nhập câu hỏi"
            onCancel={handleCancel}
            cancelText="Huỷ bỏ"
            okText="Lưu"
            okButtonProps={{
                form: 'question-form',
                htmlType: 'submit',
            }}
            confirmLoading={loading}
        >
            <Form
                layout="horizontal"
                form={form}
                id="question-form"
                validateTrigger="onBlur"
                requiredMark={false}
                className="flex-1"
                labelAlign="left"
                labelCol={{ span: 24, md: 4 }}
                wrapperCol={{ span: 24, md: 20 }}
                initialValues={{
                    open: false,
                }}
                onFinish={handleFinish}
            >
                <Form.Item label="Tên" name="chapterId" rules={[{ required: true, message: 'Hãy chọn chương' }]}>
                    <Select options={chapterOptions} placeholder="Chọn chương" />
                </Form.Item>
                <Form.Item label="Câu hỏi" name="questionsKeys">
                    <QuestionInput />
                </Form.Item>
            </Form>
        </Modal>
    );
};
