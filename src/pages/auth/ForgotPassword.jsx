import { Button, Form, Input } from 'antd';
import { ExclamationCircleOutlined, MailOutlined, LeftOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function ForgotPassWord() {
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();

    const onFinish = async () => {
        try {
            setLoading(true);
            await form.validateFields();
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="font-sans min-h-screen  w-full flex items-center justify-center bg-[url('../../assets/images/auth/authBG.png')] bg-no-repeat bg-cover bg-center shadow-lg">
            <div className="bg-white flex  items-center justify-center p-15 rounded-xl min-w-3/12">
                <Form
                    layout={{
                        labelCol: { span: 8 },
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item>
                        <div className="flex flex-col items-center justify-center">
                            <ExclamationCircleOutlined className="text-5xl " />
                            <h2 className="shadow-bottom">Quên mật khẩu</h2>
                            <p>Nhập email để lấy lại password</p>
                        </div>
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, type: 'email', message: 'Nhập email của bạn' },
                            { type: 'email', message: 'Email không hợp lệ' },
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
                    </Form.Item>

                    <Button
                        htmlType="submit"
                        type="primary"
                        loading={loading}
                        className="w-full px-6 sm:py-4 py-3  flex justify-center items-center font-bold sm:text-xl text-base "
                    >
                        Submit
                    </Button>

                    <Form.Item className="mt-3 ">
                        <Link
                            to="/auth/login"
                            className="sm:text-base text-sm flex justify-center items-center text-customBlue"
                        >
                            <LeftOutlined />
                            <p className="">Back to login</p>
                        </Link>
                    </Form.Item>
                </Form>
            </div>
        </section>
    );
}
