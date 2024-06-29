import { Button, Form, Input, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { createSubject } from '../../../requests/teacher/teacher-subjects.request';
import logo from '../../../assets/images/logo.png';

export function CreateSubject() {
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const successMessage = () => {
        messageApi.open({
            type: 'success',
            content: 'Tạo môn học thành công!',
        });
    };

    const onFinish = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            const body = {
                ...values,
            };
            await createSubject(body);
            successMessage();
            form.resetFields();
            navigate('/teacher/subjects');
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" create-subject flex  justify-center items-center  text-center  p-6">
            {contextHolder}
            <Form
                form={form}
                onSubmitCapture={onFinish}
                validateTrigger="onBlur"
                requiredMark={false}
                labelCol={{ span: 24, md: 5 }}
                labelAlign="left"
                wrapperCol={{ span: 24, md: 19 }}
                className="w-full md:w-180 form-shadow p-6"
            >
                <div className="relative m-auto text-center">
                    <CloseOutlined
                        className={`md:text-base hover:text-red-500 absolute right-0 top-0 cursor-pointer z-100`}
                        onClick={() => {
                            form.resetFields();
                            navigate('/teacher/subjects');
                        }}
                    />
                    <img
                        src={logo}
                        className="w-2/3 md:min-h-22 min-h-12 sm:object-cover object-contain relative shadow-bottom"
                        style={{ zIndex: -1 }}
                    />
                </div>
                <h1 className="md:text-4xl text-blue-900 text-center shadow-bottom mb-6">Tạo môn học</h1>

                <Form.Item
                    label="Mã môn học"
                    name="subjectNumber"
                    rules={[
                        { required: true, message: 'Nhập mã môn' },
                        { pattern: /^[A-Za-z0-9]{7}$/, message: 'Mã môn học phải gồm 7 chữ số' },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Tên môn học" name="name" rules={[{ required: true, message: 'Nhập tên môn học' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Mô tả" name="description">
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Hình ảnh" name="imageUrl">
                    <Input.TextArea rows={2} />
                </Form.Item>

                <div className="text-center">
                    <Button type="primary" loading={loading} htmlType="submit" className="mr-1">
                        Tạo
                    </Button>
                    <Button htmlType="reset" className="ml-1">
                        Hủy
                    </Button>
                </div>
            </Form>
        </div>
    );
}
