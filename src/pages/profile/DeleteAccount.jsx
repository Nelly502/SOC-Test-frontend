import { Link } from 'react-router-dom';
import { Form, Input, Button, Select } from 'antd';
import { LockOutlined, CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { deleteUserRequest } from '../../requests/profile.request';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { removeUser } from '../../redux/slices/user.slice';
import deleteAccountLogo from '../../assets/images/profile/deleteAccount.png';

function DeleteAccount({ setOption, getClassName }) {
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFinish = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            await deleteUserRequest(values);
            dispatch(removeUser());
            navigate('/auth/login');
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={getClassName(3)}>
            <Form form={form} validateTrigger="onBlur" onFinish={onFinish}>
                <div className="w-full text-right">
                    <CloseOutlined
                        className="md:text-xl text-sm hover:text-red-500 cursor-pointer"
                        onClick={() => setOption(0)}
                    />
                </div>
                <div className="text-center mb-5 ">
                    <img src={deleteAccountLogo} className="w-fit  h-25 object-contain  rounded-full"></img>
                </div>
                <Form.Item name="reason">
                    <p className="md:text-base text-left mb-2 truncate">Lí do bạn muốn xóa tài khoản này?</p>
                    <Select
                        size="large"
                        defaultValue="Bad experience"
                        className="w-11/12"
                        onChange={() => {}}
                        options={[
                            { value: 'Concerned about my data', label: 'Vấn đề về dữ liệu cá nhân', size: 'large' },
                            { value: 'Trouble getting started', label: 'Khó khăn khi bắt đầu sử dụng', size: 'large' },
                            { value: 'Too many adds', label: 'Nhiều quảng cáo', size: 'large' },
                            { value: 'Bad experience', label: 'Trải nghiệm không tốt', size: 'large' },
                            { value: 'Something else', label: 'Lí do khác', size: 'large' },
                        ]}
                    />
                </Form.Item>
                <Form.Item name="password">
                    <div className="flex flex-flow justify-between mb-2 md:text-base ">
                        <p className="truncate">Nhập lại mật khẩu</p>
                        <Link to="/forgot-password" className="flex items-center justify-center truncate">
                            Quên mật khẩu
                        </Link>
                    </div>
                    <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
                </Form.Item>

                <Button loading={loading} htmlType="submit" type="primary" className="w-1/2 truncate">
                    Xóa tài khoản
                </Button>
            </Form>
        </div>
    );
}
export default DeleteAccount;
