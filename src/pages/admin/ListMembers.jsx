import { Table, Input, Button, Tabs, Typography, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { getListMembers, deleteMember } from '../../requests/admin/admin-members.request';
import { parse, stringify } from 'qs';
import { roles } from '../../constants';

export function ListMembers() {
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({});
    const [query, setQuery] = useState({ take: 10, skip: 0 });

    const navigate = useNavigate();
    const location = useLocation();

    const getData = async () => {
        try {
            setLoading(true);

            const query = {
                take: 10,
                skip: 0,
                role: 1,
                ...(parse(location.search.slice(1)) || {}),
            };
            for (const key in query) {
                if (!['search', 'take', 'skip', 'role'].includes(key)) {
                    delete query[key];
                }
            }
            query.take = Number(query.take);
            query.skip = Number(query.skip);

            setQuery(query);

            const data = await getListMembers(query);
            setData(data);
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, [location.search]);

    const handleNavigate = (newQuery) => {
        newQuery = {
            ...query,
            ...newQuery,
        };
        navigate({ search: stringify(newQuery) });
    };

    //search member
    const handleSearch = (search) => {
        handleNavigate({ search, skip: 0 });
    };

    const handleChangeTab = (role) => {
        handleNavigate({ role, skip: 0 });
    };

    const handlePageChange = (page, pageSize) => {
        handleNavigate({ take: pageSize, skip: (page - 1) * pageSize });
    };

    const handleDeleteMember = async (id) => {
        Modal.confirm({
            title: `Bạn chắc chắn muốn xóa thành viên này?`,
            cancelText: 'Hủy bỏ',
            okText: 'Xác nhận',
            okType: 'danger',
            onOk: async () => {
                try {
                    setLoading(true);
                    await deleteMember(id);
                    await getData();
                } catch (e) {
                    //
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    //for table teacher
    let columns = [
        {
            title: 'STT',
            dataIndex: 'number',
            width: '10%',
            key: 'number',
            align: 'center',
            ellipsis: true,
            render: (text, record, index) => <>{index + 1 + query.skip}</>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: '30%',
            key: 'userEmail',
            ellipsis: true,
        },

        {
            title: 'Họ và tên',
            dataIndex: 'user',
            width: '20%',
            key: 'fullname',
            className: 'nowrap',
            render: (_, record) => `${record.familyName} ${record.givenName}`,
        },
        {
            title: 'Mobile',
            dataIndex: 'mobile',
            width: '15%',
            key: 'mobile',
            className: 'nowrap',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            width: '10%',
            key: 'role',
            className: 'nowrap',
            render: (_, record) => <Typography>{roles[record.role]}</Typography>,
        },

        {
            key: 'action',
            title: 'Action',
            dataIndex: 'action',
            className: '!p-0',
            width: '15%',
            render: (_, record) => (
                <Button onClick={() => handleDeleteMember(record.id)} icon={<DeleteOutlined />}></Button>
            ),
            align: 'center',
        },
    ];

    const TableComponent = () => {
        return (
            <Table
                columns={columns}
                dataSource={data.records}
                rowKey={(record) => record.id}
                bordered={true}
                loading={loading}
                footer={() => <p>{`Tổng số: ${data.total}`}</p>}
                scroll={{ x: true }}
                pagination={{
                    current: query.skip / query.take + 1,
                    pageSize: query.take,
                    total: data.total,
                    showSizeChanger: true,
                    onChange: handlePageChange,
                }}
            />
        );
    };

    //for table student
    let columns2 = [
        {
            title: 'STT',
            dataIndex: 'number',
            width: '10%',
            key: 'number',
            align: 'center',
            ellipsis: true,
            render: (text, record, index) => <>{index + 1 + query.skip}</>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: '30%',
            key: 'userEmail',
            ellipsis: true,
        },
        {
            title: 'Student Number',
            dataIndex: 'studentNumber',
            width: '15%',
            key: 'studentNumber',
            className: 'nowrap',
        },
        {
            title: 'Họ và tên',
            dataIndex: 'user',
            width: '20%',
            key: 'fullname',
            className: 'nowrap',
            render: (_, record) => `${record.familyName} ${record.givenName}`,
        },
        {
            title: 'Mobile',
            dataIndex: 'mobile',
            width: '10%',
            key: 'mobile',
            className: 'nowrap',
        },

        {
            key: 'action',
            title: 'Action',
            dataIndex: 'action',
            className: '!p-0',
            width: '15%',
            render: (_, record) => (
                <Button onClick={() => handleDeleteMember(record.id)} icon={<DeleteOutlined />}></Button>
            ),
            align: 'center',
        },
    ];

    const TableComponent2 = () => {
        return (
            <Table
                columns={columns2}
                dataSource={data.records}
                rowKey={(record) => record.id}
                bordered={true}
                loading={loading}
                footer={() => <p>{`Tổng số: ${data.total}`}</p>}
                scroll={{ x: true }}
                pagination={{
                    current: query.skip / query.take + 1,
                    pageSize: query.take,
                    total: data.total,
                    showSizeChanger: true,
                    onChange: handlePageChange,
                }}
            />
        );
    };

    const tabItems = [
        {
            key: 1,
            label: 'Giảng viên',
            children: <TableComponent />,
        },
        {
            key: 2,
            label: 'Sinh viên',
            children: <TableComponent2 />,
        },
    ];

    return (
        <section className="relative">
            <div className="flex justify-between flex-col md:flex-row items-center flex-wrap mb-4">
                <h1 className="text-center text-md md:text-4xl text-blue-900">Danh sách người dùng</h1>
                <div className="flex space-x-2">
                    <Input.Search
                        size="default"
                        placeholder="Tìm kiếm người dùng"
                        enterButton
                        onSearch={(value) => handleSearch(value)}
                        allowClear
                    />
                </div>
            </div>
            <Tabs defaultActiveKey={0} onChange={handleChangeTab} destroyInactiveTabPane items={tabItems} />
        </section>
    );
}
