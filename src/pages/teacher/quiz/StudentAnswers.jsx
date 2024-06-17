import { Table } from 'antd';
import { dayjs } from '../../../utils/dayjs.util.js';

export function StudentsAnswer({ studentAnswers = [] }) {
    const columns = [
        {
            title: 'STT',
            width: '10%',
            render: (_, record, index) => index + 1,
        },
        {
            title: 'Họ tên',
            dataIndex: ['classStudent', 'user'],
            ellipsis: true,
            render: (user) => `${user.familyName} ${user.givenName}`,
        },
        {
            title: 'Kết quả',
            ellipsis: true,
            render: (_, record) => `${record.correct} / ${record.total}`,
        },
        {
            title: 'Thời gian nộp',
            dataIndex: 'updatedAt',
            ellipsis: true,
            render: (time) => time && dayjs(time).format('YYYY-MM-DD HH:mm'),
        },
    ];

    return (
        <div>
            <Table
                columns={columns}
                dataSource={studentAnswers}
                rowKey={(record) => record.id}
                bordered={true}
                scroll={{ x: true }}
            />
        </div>
    );
}
