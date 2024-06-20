import { Button, Form, Input, Checkbox } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { login } from '../../requests/auth.request.js';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slices/user.slice.js';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import loginLogo from '../../assets/images/auth/login.png';
import { parse } from 'qs';

export const LoginPage = () => {
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const values = await form.validateFields();
            const data = await login(values);
            dispatch(updateUser(data.user));

            const query = parse(location.search.slice(1));
            if (query.redirect) {
                navigate(decodeURIComponent(query.redirect));
            } else {
                navigate('/');
            }
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen w-full md:p-10 md:px-20 p-1 flex items-center justify-center bg-[url('../../assets/images/auth/authBG.png')] bg-no-repeat bg-cover bg-center">
            {/* Form container */}
            <div className="bg-white flex items-center shadow-lg relative z-10 w-full block">
                {/* Image */}
                <div className="w-1/2 md:block  hidden relative">
                    <img src={loginLogo} className="w-full block object-cover" />

                    <div className="absolute inset-0 flex justify-center items-start">
                        <div className="text-right mt-24">
                            <h1 className="text-white text-5xl">Welcome to the SOC Tests &nbsp;</h1>
                        </div>
                    </div>

                    <div className="absolute inset-0 flex justify-center items-end">
                        <div className="text-right mt-4">
                            <p className="text-white mb-16">
                                <p className="text-2xl"> Chưa có tài khoản?&nbsp; </p>
                                <div className="flex justify-center">
                                    <Link to={{ pathname: '/auth/register', search: location.search }}>
                                        <Button
                                            loading={loading}
                                            className="w-full bg-gray mt-4 py-2 flex justify-center items-center font-bold md:text-xl text-base hover:opacity-80 duration-300"
                                        >
                                            Đăng ký
                                        </Button>
                                    </Link>
                                </div>
                            </p>
                        </div>
                    </div>
                </div>
                {/* Form */}
                <div className="md:w-1/2 w-full flex-col items-center place-content-center">
                    <div className="auth-form md:mx-15 p-6 bg-white text-xl">
                        <Form form={form} onSubmitCapture={handleSubmit} validateTrigger="onBlur">
                            <Form.Item>
                                <div className="text-center">
                                    <h2 className="font-bold md:text-3xl text-xl justify-center">ĐĂNG NHẬP</h2>
                                </div>
                            </Form.Item>

                            {/* Form feilds */}
                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, type: 'email', message: 'Nhập email của bạn' },
                                    { type: 'email', message: 'Email không hợp lệ' },
                                ]}
                            >
                                <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    { required: true, message: 'Nhập mật khẩu của bạn' },
                                    { min: 6, message: 'Mật khẩu cần có ít nhất 6 kí tự' },
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                            </Form.Item>

                            <Form.Item>
                                <div className="flex flex-wrap justify-between">
                                    <Form.Item valuePropName="checked" noStyle>
                                        <Checkbox className="text-gray">Ghi nhớ đăng nhập</Checkbox>
                                    </Form.Item>
                                    <Link
                                        to="/auth/forgot-password"
                                        className="md:text-base flex items-center justify-center text-customBlue"
                                    >
                                        Quên mật khẩu
                                    </Link>
                                </div>
                            </Form.Item>

                            <Form.Item>
                                <div className="flex justify-center">
                                    <Button
                                        htmlType="submit"
                                        type="primary"
                                        loading={loading}
                                        className="w-3/4 bg-blue-700  py-5  flex justify-center items-center font-bold md:text-2xl text-base hover:opacity-80 duration-300"
                                    >
                                        Đăng nhập
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </section>
    );
};
