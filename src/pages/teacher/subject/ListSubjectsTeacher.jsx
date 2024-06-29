import React, { useState, useEffect } from 'react';
import { Input, Button, Table, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router';
import { deleteSubject, getListSubjectsTeacher } from '../../../requests/teacher/teacher-subjects.request';
import { parse, stringify } from 'qs';
import { Link } from 'react-router-dom';

export function ListSubjectsTeacher() {
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
                if (!['search', 'take', 'skip'].includes(key)) {
                    delete query[key];
                }
            }
            query.take = Number(query.take);
            query.skip = Number(query.skip);
            setQuery(query);

            const data = await getListSubjectsTeacher(query);
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

    const handleDeleteSubject = async (id) => {
        Modal.confirm({
            title: `Bạn chắc chắn muốn xóa môn học này?`,
            cancelText: 'Hủy bỏ',
            okText: 'Xác nhận',
            okType: 'danger',
            onOk: async () => {
                try {
                    setLoading(true);
                    await deleteSubject(id);
                    await getData();
                } catch (e) {
                    //
                } finally {
                    setLoading(false);
                }
            },
        });
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
            title: 'Mã môn học',
            dataIndex: 'subject',
            width: '20%',
            key: 'subjectNumber',
            render: (_, subject) => (
                <>
                    <Link to={`/teacher/subjects/${subject.id}`}>{subject.subjectNumber}</Link>
                </>
            ),
        },

        {
            title: 'Tên môn học',
            dataIndex: 'name',
            width: '30%',
            key: 'name',
            className: 'nowrap',
            render: (_, subject) => (
                <>
                    <Link to={`/teacher/subjects/${subject.id}`}>{subject.name}</Link>
                </>
            ),
        },

        {
            title: 'Mô tả',
            dataIndex: 'description',
            width: '30%',
            key: 'description',
            ellipsis: true,
        },
        {
            key: 'action',
            title: 'Action',
            dataIndex: 'action',
            className: '!p-0',
            width: '15%',
            render: (_, record) => (
                <Button onClick={() => handleDeleteSubject(record.id)} icon={<DeleteOutlined />}></Button>
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
                    <Button onClick={() => navigate('/teacher/subjects/create')}>Tạo môn học mới</Button>
                </div>
            </div>
            <TableComponent />,
        </section>
    );
}
