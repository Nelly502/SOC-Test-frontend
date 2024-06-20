import { Button, Input, Modal, Switch, Table } from 'antd';
import { parse, stringify } from 'qs';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { deleteQuizzes, getListQuizzes, updateQuiz } from '../../../../../requests/teacher/teacher-quizzes.request.js';
import { Link } from 'react-router-dom';
import { dayjs } from '../../../../../utils/dayjs.util.js';

export function Quizzes() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [query, setQuery] = useState({ take: 10, skip: 0 });

    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    useEffect(() => {
        getData();
    }, [location.search]);

    const getData = async () => {
        try {
            setLoading(true);

            const query = {
                take: 10,
                skip: 0,
                ...(parse(location.search.slice(1)) || {}),
            };
            for (const key in query) {
                if (!['search', 'take', 'skip'].includes(key)) {
                    delete query[key];
                }
            }
            query.take = Number(query.take);
            query.skip = Number(query.skip);
            setQuery(query);

            const data = await getListQuizzes({ classId: id, ...query });
            setData(data);
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
    };

    const toggleOpenQuiz = async (id, open) => {
        try {
            setLoading(true);
            const body = { open };
            
            await updateQuiz(id, body);
            getData();
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        if (!selectedRowKeys.length) {
            return;
        }
        Modal.confirm({
            title: 'Xóa quiz',
            content: 'Chắc chắn xóa những quiz này?',
            async onOk() {
                try {
                    setLoading(true);
                    await deleteQuizzes(selectedRowKeys);
                    await getData();
                } catch (e) {
                    //
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    const handleNavigate = (newQuery) => {
        newQuery = { ...query, ...newQuery };
        navigate({ search: stringify(newQuery) }, { replace: true });
    };

    const handleSearch = (search) => {
        handleNavigate({ search, skip: 0 });
    };

    const handlePageChange = (page, pageSize) => {
        handleNavigate({ take: pageSize, skip: (page - 1) * pageSize });
    };

    const columns = [
        {
            title: 'Tên quiz',
            dataIndex: 'name',
            ellipsis: true,
            render: (name, record) => <Link to={`/teacher/quizzes/${record.id}`}>{name}</Link>,
        },
        {
            title: 'Trạng thái',
            width: '10%',
            dataIndex: 'open',
            ellipsis: true,
            render: (open, record) => (
                <Switch checked={open} onChange={(checked) => toggleOpenQuiz(record.id, checked)} />
            ),
        },
        {
            title: 'Thời gian đóng',
            dataIndex: 'closeTime',
            ellipsis: true,
            render: (time) => time && dayjs(time).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: 'Thời gian tạo',
            dataIndex: 'createdAt',
            ellipsis: true,
            render: (time) => time && dayjs(time).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: 'Thời gian sửa',
            dataIndex: 'updatedAt',
            ellipsis: true,
            render: (time) => time && dayjs(time).format('YYYY-MM-DD HH:mm'),
        },
    ];

    return (
        <div>
            <div className="flex justify-between">
                <div>
                    <Button onClick={handleDelete}>Xoá</Button>
                </div>
                <div className="flex space-x-2 ml-2">
                    <Input.Search
                        placeholder="Tìm kiếm"
                        enterButton
                        onSearch={(value) => handleSearch(value)}
                        allowClear
                    />
                    <Button type="primary" onClick={() => navigate('create')}>
                        Tạo quiz
                    </Button>
                </div>
            </div>
            <div className="mt-3">
                <Table
                    columns={columns}
                    dataSource={data.records}
                    bordered={true}
                    loading={loading}
                    scroll={{ x: true }}
                    rowKey={(record) => record.id}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
                    }}
                    pagination={{
                        current: query.skip / query.take + 1,
                        pageSize: query.take,
                        total: data.total,
                        showSizeChanger: true,
                        onChange: handlePageChange,
                    }}
                />
            </div>
        </div>
    );
}
