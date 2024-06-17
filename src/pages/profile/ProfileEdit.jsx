import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { UserOutlined, UsergroupAddOutlined, PhoneOutlined, CloseOutlined, NumberOutlined } from '@ant-design/icons';
import profileEdit from '../../assets/images/profile/profileEdit.jpg';
import { updateUser } from '../../redux/slices/user.slice';
import { updateUserRequest } from '../../requests/profile.request';

function ProfileEdit({ currOption, option, setOption, getClassName }) {
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.user);
    const [edit, setEdit] = useState(false);

    const dispatch = useDispatch();

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const successMessage = () => {
        messageApi.open({
            type: 'success',
            content: 'Chỉnh sửa thành công!',
        });
    };

    const onFinish = async () => {
        try {
            if (!edit) return;
            setLoading(true);
            const values = await form.validateFields();
            const data = await updateUserRequest(values, user.id);
            dispatch(updateUser(data));

            successMessage();
        } catch (e) {
            //
        } finally {
            setLoading(false);
            setEdit(false);
        }
    };

    return (
        <div
            className={getClassName(1)}
            style={{ zIndex: 10, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 -8px 10px -6px rgb(0 0 0 / 0.1);' }}
        >
            {contextHolder}
            <div className="w-full text-right">
                <CloseOutlined
                    className="md:text-xl text-sm hover:text-red-500 cursor-pointer"
                    onClick={() => {
                        setOption(0);
                    }}
                />
            </div>
            <div className="text-center mb-5">
                <img src={profileEdit} className="w-fit  h-25 object-contain  rounded-full"></img>
            </div>

            <Form form={form} validateTrigger="onBlur" initialValues={user} onFinish={onFinish}>
                <Form.Item name="familyName" rules={[{ required: true, message: 'Nhập tên họ của bạn' }]}>
                    <Input readOnly={!edit} prefix={<UsergroupAddOutlined />} placeholder="Họ" size="large" />
                </Form.Item>

                <Form.Item name="givenName" rules={[{ required: true, message: 'Nhập tên của bạn' }]}>
                    <Input readOnly={!edit} prefix={<UserOutlined />} placeholder="Tên" size="large" />
                </Form.Item>

                {user.role === 2 ? (
                    <Form.Item
                        name="studentNumber"
                        rules={[
                            { required: true, message: 'Nhập MSSV' },
                            { min: 8, message: 'MSSV cần ít nhất 8 kí tự' },
                        ]}
                    >
                        <Input readOnly={!edit} prefix={<NumberOutlined />} placeholder="MSSV" size="large" />
                    </Form.Item>
                ) : null}

                <Form.Item name="mobile">
                    <Input readOnly={!edit} prefix={<PhoneOutlined />} placeholder="SDT" size="large" />
                </Form.Item>

                <div className="m-auto w-2/3 flex justify-center truncate">
                    {edit === true ? (
                        <>
                            <Button type="primary" htmlType="submit" loading={loading} className="mr-1">
                                Lưu
                            </Button>
                            <Button htmlType="reset" onClick={() => setEdit(false)} className="ml-1">
                                Hủy
                            </Button>
                        </>
                    ) : (
                        <Button
                            type="primary"
                            onClick={(e) => {
                                e.preventDefault();
                                setEdit(true);
                            }}
                        >
                            Chỉnh Sửa
                        </Button>
                    )}
                </div>
            </Form>
        </div>
    );
}
export default ProfileEdit;
