import { Table, Input, Button, Dropdown, Tabs, Switch } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { getClasses, updateClass, hideShowClass } from '../../../requests/teacher/teacher-classes.request';
import { parse, stringify } from 'qs';

export function ListClasses() {
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
                ...(parse(location.search.slice(1)) || {}),
            };
            for (const key in query) {
                if (!['search', 'take', 'skip', 'hidden'].includes(key)) {
                    delete query[key];
                }
            }
            query.take = Number(query.take);
            query.skip = Number(query.skip);
            setQuery(query);

            const data = await getClasses(query);
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

    //class actions
    const handleToggleView = async (record) => {
        try {
            setLoading(true);
            await hideShowClass(record.classId, !record.hidden);
            getData();
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
    };

    //search class
    const handleSearch = (search) => {
        handleNavigate({ search, skip: 0 });
    };

    const handleChangeTab = (hidden) => {
        handleNavigate({ hidden, skip: 0 });
    };

    const handlePageChange = (page, pageSize) => {
        handleNavigate({ take: pageSize, skip: (page - 1) * pageSize });
    };

    const handleToggleRequirePermission = async (id, requirePermission) => {
        await updateClass(id, { requirePermission });
    };

    //for table
    let columns = [
        {
            title: 'STT',
            dataIndex: 'number',
            width: '5%',
            key: 'number',
            align: 'center',
            ellipsis: true,
            render: (text, record, index) => <>{index + 1 + query.skip}</>,
        },
        {
            title: 'Mã lớp',
            dataIndex: 'class',
            width: '20%',
            key: 'classNumber',
            render: (_class) => (
                <>
                    <Link to={`/teacher/classes/${_class.id}`}>{_class.classNumber}</Link>
                </>
            ),
        },
        {
            title: 'Tên lớp',
            dataIndex: 'class',
            width: '30%',
            key: 'name',
            className: 'nowrap',
            render: (_class) => (
                <>
                    <Link to={`/teacher/classes/${_class.id}`}>{_class.name}</Link>
                </>
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: ['class', 'description'],
            width: '30%',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Yêu cầu quyền truy cập',
            dataIndex: 'class',
            width: '15%',
            key: 'requirePermission',
            render: (_class) => (
                <Switch
                    defaultChecked={_class.requirePermission}
                    onChange={(checked) => handleToggleRequirePermission(_class.id, checked)}
                />
            ),
            ellipsis: true,
        },
        {
            key: 'action',
            title: ' ',
            dataIndex: 'class',
            className: '!p-0',
            width: '10%',
            render: (_, record) => (
                <Dropdown
                    placement="bottomRight"
                    menu={{
                        items: [{ label: record.hidden ? 'Hiện' : 'Ẩn', onClick: () => handleToggleView(record) }],
                    }}
                >
                    <EllipsisOutlined className="cursor-pointer p-4" />
                </Dropdown>
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
            key: 0,
            label: 'Các lớp hiển thị',
            children: <TableComponent />,
        },
        {
            key: 1,
            label: 'Các lớp đã ẩn',
            children: <TableComponent />,
        },
    ];

    return (
        <section className="relative">
            <div className="flex justify-between flex-col md:flex-row items-center flex-wrap mb-4">
                <h1 className="text-center text-md md:text-4xl text-blue-900">Danh sách lớp học</h1>
                <div className="flex space-x-2">
                    <Input.Search
                        size="default"
                        placeholder="Tìm kiếm mã lớp/tên lớp"
                        enterButton
                        onSearch={(value) => handleSearch(value)}
                        allowClear
                    />
                    <Button onClick={() => navigate('/teacher/classes/create')}>Tạo lớp</Button>
                </div>
            </div>
            <Tabs defaultActiveKey={0} onChange={handleChangeTab} destroyInactiveTabPane items={tabItems} />
        </section>
    );
}
