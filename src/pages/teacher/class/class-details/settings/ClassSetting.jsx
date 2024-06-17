import { Button, Form, Input, Switch, message, Modal } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { updateClass, deleteClasses } from '../../../../../requests/teacher/teacher-classes.request';

export function ClassSetting({ classInfo, onChangeClassInfo }) {
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const navigate = useNavigate();
    const [form] = Form.useForm();

    const successMessage = () => {
        message.success('Chỉnh sửa thành công!');
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            const data = await updateClass(classInfo.id, values);
            onChangeClassInfo(data);
            successMessage();
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClass = async () => {
        try {
            Modal.confirm({
                title: `Bạn có muốn xóa lớp học này?`,
                cancelText: 'Hủy bỏ',
                okText: 'Xác nhận',
                okType: 'danger',
                confirmLoading: deleteLoading,
                onOk: async () => {
                    try {
                        setDeleteLoading(true);
                        await deleteClasses([Number(classInfo.id)]);
                        navigate('/teacher/classes');
                    } catch (e) {
                        //
                    } finally {
                        setDeleteLoading(false);
                    }
                },
            });
        } catch (e) {
            //
        }
    };

    return (
        <Form
            initialValues={classInfo}
            layout="horizontal"
            form={form}
            onSubmitCapture={handleSubmit}
            validateTrigger="onBlur"
            requiredMark={false}
            className="w-150 max-w-full rounded m-auto "
            size="large"
            labelCol={{ span: 24, md: 6 }}
            wrapperCol={{ span: 24, md: 18 }}
        >
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
            <Form.Item label="Yêu cầu truy cập" name="requirePermission" valuePropName="checked">
                <Switch className="ml-1 text-left" />
            </Form.Item>
            <div className="text-center">
                <Button
                    type="primary"
                    onClick={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    loading={loading}
                >
                    Cập nhật
                </Button>
                <Button
                    type="primary"
                    danger
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClass();
                    }}
                    className="ml-2"
                >
                    Xóa lớp
                </Button>
            </div>
        </Form>
    );
}
