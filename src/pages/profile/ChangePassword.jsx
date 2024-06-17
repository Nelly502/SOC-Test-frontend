import { Button, Form, Input, message } from 'antd';
import { LockOutlined, UnlockOutlined, CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import changePasswordLogo from '../../assets/images/profile/changePassword.png';
import { changePassword } from '../../requests/auth.request';
import { updateUser } from '../../redux/slices/user.slice';

function ChangePassword({ setOption, getClassName }) {
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const dispatch = new useDispatch();
    const [form] = Form.useForm();
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
            const sendValues = {
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
            };
            const data = await changePassword(sendValues);
            dispatch(updateUser(data));
            successMessage();
            form.resetFields();
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={getClassName(2)}>
            {contextHolder}
            <Form form={form} validateTrigger="onBlur" onFinish={onFinish}>
                <div className="w-full text-right">
                    <CloseOutlined
                        className="md:text-xl text-sm hover:text-red-500 cursor-pointer"
                        onClick={() => {
                            setOption(0);
                        }}
                    />
                </div>
                <div className="text-center mb-5 ">
                    <img src={changePasswordLogo} className="w-fit  h-25 object-contain  rounded-full"></img>
                </div>
                <Form.Item name="oldPassword" rules={[{ required: true, message: 'Nhập mật khẩu hiện tại' }]}>
                    <Input.Password prefix={<UnlockOutlined />} placeholder="Mật khẩu hiện tại" size="large" />
                </Form.Item>
                <Form.Item
                    name="newPassword"
                    rules={[
                        { required: true, message: 'Nhập mật khẩu mới' },
                        { min: 6, message: 'Mật khẩu cần ít nhất 6 kí tự' },
                    ]}
                >
                    <Input.Password
                        onChange={(e) => setNewPassword(e.target.value)}
                        prefix={<LockOutlined />}
                        placeholder="Mật khẩu mới"
                        size="large"
                    />
                </Form.Item>
                <Form.Item
                    name="confirmNewPassword"
                    rules={[
                        { required: true, message: 'Xác nhận lại mật khẩu' },
                        {
                            validator: () => {
                                return confirmNewPassword && newPassword && newPassword !== confirmNewPassword
                                    ? Promise.reject(new Error('Mật khẩu không trùng khớp'))
                                    : Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Input.Password
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        prefix={<CheckCircleOutlined />}
                        placeholder="Xác nhận mật khẩu"
                        size="large"
                    />
                </Form.Item>

                <div className="m-auto w-1/2 flex justify-center truncate">
                    <Button type="primary" htmlType="submit" loading={loading} className="mr-1">
                        Lưu
                    </Button>
                    <Button htmlType="reset" className="ml-1">
                        Hủy
                    </Button>
                </div>
            </Form>
        </div>
    );
}
export default ChangePassword;
