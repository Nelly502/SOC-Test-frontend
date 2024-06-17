import { Input, Modal, message } from 'antd';
import { useState } from 'react';
import { joinClass } from '../../../requests/student/student-classes.request';

export function JoinClassModal({ open, onClose, onJoin }) {
    const [loading, setLoading] = useState(false);
    const [classNumber, setClassNumber] = useState('');

    const handleCancel = () => {
        onClose();
        setClassNumber('');
    };

    const handleJoinClass = async () => {
        try {
            setLoading(true);
            await joinClass({ classNumber });
            message.success('Tham gia thành công!');
            onJoin();
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal
                title="Tham gia lớp học"
                open={open}
                cancelText="Hủy"
                okText="Tham gia"
                onCancel={handleCancel}
                onOk={handleJoinClass}
                confirmLoading={loading}
            >
                <Input
                    allowClear
                    size="default"
                    placeholder="Nhập mã lớp"
                    value={classNumber}
                    onChange={(e) => setClassNumber(e.target.value)}
                />
            </Modal>
        </>
    );
}
