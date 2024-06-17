import { Input, Table } from 'antd';
import { parse, stringify } from 'qs';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { getListQuizzes } from '../../../../../requests/student/student-quizzes.request.js';
import { Link } from 'react-router-dom';
import { dayjs } from '../../../../../utils/dayjs.util.js';

export function Quizzes() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
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
                ...parse(location.search.slice(1)),
            };
            query.take = Number(query.take);
            query.skip = Number(query.skip);
            setQuery(query);

            const params = { classId: id };
            if (query.search) {
                params.search = query.search;
            }

            const data = await getListQuizzes(params);
            setData(data);
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
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
            render: (name, record) => <Link to={`/student/quizzes/${record.id}`}>{name}</Link>,
        },
        {
            title: 'Trạng thái',
            width: '10%',
            dataIndex: 'open',
            ellipsis: true,
            render: (open) => (open ? 'Mở' : 'Đóng'),
        },
        {
            title: 'Thời gian đóng',
            dataIndex: 'closeTime',
            ellipsis: true,
            render: (time) => (time ? dayjs(time).format('YYYY-MM-DD HH:mm') : ''),
        },
        {
            title: 'Thời gian tạo',
            dataIndex: 'createdAt',
            ellipsis: true,
            render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: 'Kết quả',
            dataIndex: ['studentAnswers', 0],
            ellipsis: true,
            render: (result) => result && `${result.correct} / ${result.total}`,
        },
        {
            title: 'Thời gian nộp',
            dataIndex: ['studentAnswers', 0, 'updatedAt'],
            ellipsis: true,
            render: (time) => time && dayjs(time).format('YYYY-MM-DD HH:mm'),
        },
    ];

    return (
        <div>
            <div className="flex justify-between">
                <div></div>
                <div className="flex space-x-2 flex-1 md:flex-none">
                    <Input.Search
                        placeholder="Tìm kiếm"
                        enterButton
                        onSearch={(value) => handleSearch(value)}
                        allowClear
                    />
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
                    pagination={{
                        current: query.skip / query.take + 1,
                        pageSize: query.take,
                        total: query.total,
                        pageSizeOptions: [1, 2, 3],
                        showSizeChanger: true,
                        onChange: handlePageChange,
                    }}
                />
            </div>
        </div>
    );
}
