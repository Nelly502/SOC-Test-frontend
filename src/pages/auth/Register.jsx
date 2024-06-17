import { Button, Form, Input, Checkbox, Select, Space } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined, IssuesCloseOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { register } from '../../requests/auth.request.js';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slices/user.slice.js';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import registerLogo from '../../assets/images/auth/login.png';
import { parse } from 'qs';

export const Register = () => {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState(1); //teacher
    const [agree, setAgree] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            delete values['confirmPassword'];
            const body = {
                ...values,
                role,
            };
            const data = await register(body);
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
        <section className="min-h-screen  w-full md:py-10 md:px-20  p-2   flex items-center justify-center bg-[url('../../assets/images/auth/authBG.png')] bg-no-repeat bg-cover bg-center">
            {/* Form container */}
            <div className="bg-white flex items-center shadow-lg relative z-10 w-full block">
                {/* Image */}
                <div className="w-1/2 md:block  hidden relative">
                    <img src={registerLogo} className="w-full block object-cover" />

                    <div className="absolute inset-0 flex justify-center items-end">
                        <div className="text-right mt-4">
                            <p className="text-white mb-16">
                                <p className="text-2xl "> Đã có tài khoản?&nbsp;</p>
                                <div className="flex justify-center">
                                    <Link to="/auth/login">
                                        <Button
                                            loading={loading}
                                            className="w-full bg-gray mt-4 py-2 flex justify-center items-center font-bold md:text-xl text-base hover:opacity-80 duration-300"
                                        >
                                            Đăng nhập
                                        </Button>
                                    </Link>
                                </div>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="md:w-1/2 w-full flex-col items-center justify-center  ">
                    <div className="auth-form md:mx-15 md:my-5 p-6  bg-white ">
                        <Form form={form} onSubmitCapture={handleSubmit} validateTrigger="onBlur" className="w-full ">
                            {/* Form header */}

                            <Form.Item>
                                <div className="text-center">
                                    <h2 className="font-bold md:text-3xl text-xl">ĐĂNG KÝ</h2>
                                </div>
                            </Form.Item>

                            {/* Form fields */}

                            <Space direction="horizontal" className="flex justify-between">
                                <Form.Item name="familyName" rules={[{ required: true, message: 'Nhập họ của bạn' }]}>
                                    <Input prefix={<UserOutlined />} placeholder="Họ" size="large" />
                                </Form.Item>
                                <Form.Item name="givenName" rules={[{ required: true, message: 'Nhập tên của bạn' }]}>
                                    <Input placeholder="Tên" size="large" />
                                </Form.Item>
                            </Space>

                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, type: 'email', message: 'Nhập email của bạn' },
                                    { type: 'email', message: 'Email không hợp lệ' },
                                ]}
                            >
                                <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    { required: true, message: 'Tạo mật khẩu' },
                                    { min: 6, message: 'Mật khẩu cần ít nhất 6 kí tự' },
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                            </Form.Item>
                            <Form.Item
                                name="confirmPassword"
                                rules={[
                                    { required: true, message: 'Xác nhận mật khẩu' },
                                    {
                                        validator: () => {
                                            const confirmPassword = form.getFieldValue('confirmPassword');
                                            const password = form.getFieldValue('password');
                                            return confirmPassword && password && password !== confirmPassword
                                                ? Promise.reject(new Error('Mật khẩu không trùng khớp'))
                                                : Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                <Input.Password
                                    prefix={<IssuesCloseOutlined />}
                                    placeholder="Xác nhận mật khẩu"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                name="studentNumber"
                                rules={
                                    role === 2
                                        ? [
                                              { required: true, message: 'Nhập MSSV của bạn' },
                                              { min: 8, message: 'MSSV cần ít nhất 8 kí tự' },
                                          ]
                                        : []
                                }
                            >
                                <Input
                                    addonBefore={
                                        <Select
                                            defaultValue="Giảng viên"
                                            className=""
                                            onChange={(role) => setRole(role)}
                                            options={[
                                                { value: 1, label: 'Giảng viên' },
                                                { value: 2, label: 'Sinh viên' },
                                            ]}
                                            size="large"
                                        />
                                    }
                                    placeholder="MSSV"
                                    size="large"
                                    disabled={role === 1}
                                />
                            </Form.Item>

                            <Form.Item valuePropName="checked" noStyle>
                                <div className=" md:text-base flex justify-left items-center w-full mb-3 ">
                                    <Checkbox className="text-gray-500 flex" onChange={() => setAgree(!agree)}>
                                        Tôi đồng ý với{' '}
                                        <Link className=" inline text-customBlue ">các điều khoản và điều kiện</Link>
                                    </Checkbox>
                                </div>
                            </Form.Item>
                            <div className="flex justify-center">
                                <Button
                                    htmlType="submit"
                                    disabled={!agree}
                                    type="primary"
                                    loading={loading}
                                    className="w-3/4 bg-blue-700  py-5 flex justify-center items-center  font-bold md:text-2xl mb-3 text-base hover:opacity-80 duration-300 my-1"
                                >
                                    Đăng ký
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </section>
    );
};
