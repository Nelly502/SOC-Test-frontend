import { useEffect, useState } from 'react';
import { acceptMember, deleteMember, getStudents } from '../../../../../requests/teacher/teacher-members.request.js';
import { Button, Dropdown, Input, Modal, Table } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

export function Students({ classId, onShowAdd, update }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [query, setQuery] = useState({ classId, take: 10, skip: 0 });

    const getData = async () => {
        try {
            setLoading(true);
            const data = await getStudents(query);
            setData(data);
            console.log(data);
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, [query, update]);

    const handleNavigate = (newQuery) => {
        setQuery({ ...query, ...newQuery });
    };

    const handleSearch = (search) => {
        handleNavigate({ search, skip: 0 });
    };

    const handlePageChange = (page, pageSize) => {
        handleNavigate({ take: pageSize, skip: (page - 1) * pageSize });
    };

    const handleDeleteMember = async (id) => {
        Modal.confirm({
            title: `Bạn có muốn xóa thành viên này khỏi lớp học`,
            cancelText: 'Hủy bỏ',
            okText: 'Xác nhận',
            okType: 'danger',
            onOk: async () => {
                try {
                    setLoading(true);
                    await deleteMember(classId, [id]);
                    await getData();
                } catch (e) {
                    //
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    const handleAcceptMember = async (id) => {
        try {
            setLoading(true);
            await acceptMember(id);
            await getData();
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
    };

    let columns = [
        {
            title: 'STT',
            dataIndex: 'number',
            key: 'number',
            ellipsis: true,
            align: 'center',
            width: '15%',
            render: (text, record, index) => <>{index + 1 + query.skip}</>,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'user',
            key: 'fullName',
            ellipsis: true,
            render: (user) => `${user.familyName} ${user.givenName}`,
        },
        {
            title: 'MSSV',
            dataIndex: ['user', 'studentNumber'],
            key: 'studentNumber',
            ellipsis: true,
            align: 'center',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'waiting',
            key: 'waiting',
            ellipsis: true,
            align: 'center',
            render: (_, record) => <>{record.waiting ? 'Chờ phê duyệt' : 'Đã tham gia'}</>,
        },
        {
            key: 'action',
            dataIndex: 'userId',
            render: (userId, record) => (
                <Dropdown
                    placement="bottomRight"
                    menu={{
                        items: [
                            { label: 'Xoá thành viên', onClick: () => handleDeleteMember(userId) },
                            record.waiting && {
                                label: 'Duyệt thành viên',
                                onClick: () => handleAcceptMember(record.id),
                            },
                        ],
                    }}
                >
                    <EllipsisOutlined className="cursor-pointer" />
                </Dropdown>
            ),
            width: '15%',
            align: 'center',
        },
    ];

    return (
        <div>
            <div className="flex justify-end">
                <div className="flex items-center space-x-2 w-full md:w-fit">
                    <Input.Search
                        allowClear
                        size="default"
                        placeholder="Tìm kiếm thành viên"
                        enterButton
                        onSearch={(value) => handleSearch(value)}
                    />
                    <Button onClick={onShowAdd}>Thêm thành viên</Button>
                </div>
            </div>
            <Table
                className="mt-6 w-full"
                columns={columns}
                dataSource={data.records}
                rowKey={(record) => record.id}
                bordered
                loading={loading}
                footer={() => <p className="md:pl-10">{`Tổng số: ${data.total}`}</p>}
                scroll={{ x: true }}
                pagination={{
                    current: query.skip / query.take + 1,
                    total: data.total,
                    pageSize: query.take,
                    showSizeChanger: true,
                    onChange: handlePageChange,
                }}
            />
        </div>
    );
}
