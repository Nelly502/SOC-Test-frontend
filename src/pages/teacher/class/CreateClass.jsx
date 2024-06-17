import { Button, Form, Input, Switch, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { createClass } from '../../../requests/teacher/teacher-classes.request';
import logo from '../../../assets/images/logo.png';

export function CreateClass() {
    const [requirePermission, setRequirePermission] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const successMessage = () => {
        messageApi.open({
            type: 'success',
            content: 'Tạo lớp thành công!',
        });
    };

    const onFinish = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            const body = {
                ...values,
                requirePermission,
            };
            await createClass(body);
            successMessage();
            form.resetFields();
            setRequirePermission(false);
            navigate('/teacher/classes');
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" create-class flex  justify-center items-center  text-center  p-6">
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
                            navigate('/teacher/classes');
                        }}
                    />
                    <img
                        src={logo}
                        className="w-2/3 md:min-h-22 min-h-12 sm:object-cover object-contain relative shadow-bottom"
                        style={{ zIndex: -1 }}
                    />
                </div>
                <h1 className="md:text-4xl text-blue-900 text-center shadow-bottom mb-6">Tạo lớp</h1>

                <Form.Item
                    label="Mã lớp"
                    name="classNumber"
                    rules={[
                        { required: true, message: 'Nhập mã lớp' },
                        { pattern: /^\d{6}$/, message: 'Mã lớp phải gồm 6 chữ số' },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Tên lớp" name="name" rules={[{ required: true, message: 'Nhập tên lớp' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Mô tả" name="description">
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item label="Yêu cầu truy cập" valuePropName="requirePermission">
                    <Switch className="ml-1 text-left" onChange={() => setRequirePermission((pre) => !pre)} />
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
