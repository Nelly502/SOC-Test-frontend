import { Table, Input, Button, Dropdown, message, Tabs } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { JoinClassModal } from './JoinClassModal';
import { getClasses, hideShowClass } from '../../../requests/student/student-classes.request';
import { parse, stringify } from 'qs';

export function ListClasses() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [query, setQuery] = useState({ take: 10, skip: 0 });
    const [openJoinClassModal, setOpenJoinClassModal] = useState(false);

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

    const handleJoinClass = () => {
        getData();
        closeJoinClassModal();
    };

    const showJoinClassModal = () => {
        setOpenJoinClassModal(true);
    };

    const closeJoinClassModal = () => {
        setOpenJoinClassModal(false);
    };

    const handleMessage = (waiting) => {
        if (waiting) message.info('Yêu cầu truy cập chưa được phê duyệt!');
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
            render: (_class, record) => (
                <>
                    <Link
                        to={record.waiting ? '#' : `/student/classes/${_class.id}`}
                        onClick={() => handleMessage(record.waiting)}
                    >
                        {_class.classNumber}
                    </Link>
                </>
            ),
        },
        {
            title: 'Tên lớp',
            dataIndex: 'class',
            width: '30%',
            key: 'name',
            className: 'nowrap',
            render: (_class, record) => (
                <>
                    <Link
                        to={record.waiting ? '#' : `/student/classes/${_class.id}`}
                        onClick={() => handleMessage(record.waiting)}
                    >
                        {_class.name}
                    </Link>
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
            title: 'Trạng thái',
            dataIndex: 'waiting',
            width: '15%',
            key: 'waiting',
            ellipsis: true,
            render: (waiting) => <>{waiting ? 'Chờ phê duyệt' : 'Đã tham gia'}</>,
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
                <h1 className="text-center text-md md:text-4xl text-blue-900">DANH SÁCH LỚP HỌC</h1>
                <div className="flex space-x-2">
                    <Input.Search
                        size="default"
                        placeholder="Tìm kiếm mã lớp/tên lớp"
                        enterButton
                        onSearch={(value) => handleSearch(value)}
                        allowClear
                    />

                    <Button onClick={showJoinClassModal}>Tham gia lớp</Button>
                </div>
            </div>
            <Tabs defaultActiveKey={0} onChange={handleChangeTab} destroyInactiveTabPane items={tabItems} />
            <JoinClassModal open={openJoinClassModal} onClose={closeJoinClassModal} onJoin={handleJoinClass} />
        </section>
    );
}
