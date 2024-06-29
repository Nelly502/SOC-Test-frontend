import { Input, Modal } from 'antd';
import { useState } from 'react';
import { updateChapter } from '../../../../requests/teacher/teacher-chapters.request';

export const UpdateChapterModal = ({ open, chapterInfo, onSaved, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState(chapterInfo.title);

    const handleCancel = () => {
        setValue(chapterInfo.value);
        onCancel();
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            await updateChapter(chapterInfo.id, { title: value });
            onCancel();
            onSaved();
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            title="Đổi tên chương"
            confirmLoading={loading}
            onOk={handleSave}
            okText="Xác nhận"
            onCancel={handleCancel}
            cancelText="Huỷ bỏ"
        >
            <Input placeholder="Nhập tên chương" value={value} onChange={(e) => setValue(e.target.value)} />
        </Modal>
    );
};
