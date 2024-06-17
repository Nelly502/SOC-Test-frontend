import { useEffect, useState } from 'react';
import { deleteMember, getTeachers } from '../../../../../requests/teacher/teacher-members.request.js';
import { Button, Dropdown, Input, Modal, Table } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

export function Teachers({ classId, onShowAdd, update }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [query, setQuery] = useState({ classId, take: 10, skip: 0 });

    const getData = async () => {
        try {
            setLoading(true);
            const data = await getTeachers(query);
            setData(data);
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
        handleNavigate({ search, take: 0 });
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

    let columns = [
        {
            title: 'STT',
            dataIndex: 'number',
            key: 'number',
            width: '20%',
            align: 'center',
            render: (text, record, index) => <>{index + 1 + query.skip}</>,
        },
        {
            title: 'Họ và tên',
            key: 'fullName',
            dataIndex: 'user',
            ellipsis: true,
            render: (user) => `${user.familyName} ${user.givenName}`,
        },
        {
            key: 'action',
            dataIndex: 'userId',
            render: (id) => (
                <Dropdown
                    placement="bottomRight"
                    menu={{
                        items: [{ label: 'Xoá thành viên', onClick: () => handleDeleteMember(id) }],
                    }}
                >
                    <EllipsisOutlined className="cursor-pointer" />
                </Dropdown>
            ),
            width: '20%',
            align: 'center',
        },
    ];

    return (
        <div>
            <div className="flex justify-end">
                <div className="flex items-center space-x-2">
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
