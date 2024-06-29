import React, { useState, useEffect } from 'react';
import { Input, Table, Tabs } from 'antd';
// import { DeleteOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router';
import { parse, stringify } from 'qs';
import { Link } from 'react-router-dom';
import { getListSubjectsStudent } from '../../../requests/student/student-subjects.request';

export function ListSubjectsStudent() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
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
                if (!['search', 'take', 'skip', 'role'].includes(key)) {
                    delete query[key];
                }
            }
            query.take = Number(query.take);
            query.skip = Number(query.skip);
            setQuery(query);

            const data = await getListSubjectsStudent(query);
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

    const handlePageChange = (page, pageSize) => {
        handleNavigate({ take: pageSize, skip: (page - 1) * pageSize });
    };

    //for table
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
            title: 'Mã môn học',
            dataIndex: 'subject',
            width: '20%',
            key: 'subjectNumber',
            render: (_, subject) => (
                <>
                    <Link to={`/student/subjects/${subject.id}`}>{subject.subjectNumber}</Link>
                </>
            ),
        },
        {
            title: 'Tên môn học',
            dataIndex: 'subject',
            width: '35%',
            key: 'name',
            className: 'nowrap',
            render: (_, subject) => (
                <>
                    <Link to={`/student/subjects/${subject.id}`}>{subject.name}</Link>
                </>
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: ['subject', 'description'],
            width: '35%',
            key: 'description',
            ellipsis: true,
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
            label: 'Các môn học hiển thị',
            children: <TableComponent />,
        },
    ];

    return (
        <section className="relative">
            <div className="flex justify-between flex-col md:flex-row items-center flex-wrap mb-4">
                <h1 className="text-center text-md md:text-4xl text-blue-900">Danh sách môn học</h1>
                <div className="flex space-x-2">
                    <Input.Search
                        size="default"
                        placeholder="Tìm kiếm tên môn học"
                        enterButton
                        onSearch={(value) => handleSearch(value)}
                        allowClear
                    />
                </div>
            </div>
            <Tabs defaultActiveKey={0} items={tabItems} />
        </section>
    );
}
