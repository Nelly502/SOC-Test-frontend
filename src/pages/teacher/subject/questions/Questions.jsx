import { Button, Dropdown, Input, Modal, Table } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { deleteQuestion, getListQuestionsTeacher } from '../../../../requests/teacher/teacher-questions.request';
import { UpdateChapterModal } from '../chapters/UpdateChapterModal';
import { QuestionModal } from './QuestionModal';

export const Questions = ({ chapterInfo, onUpdateChapter }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [query, setQuery] = useState({ chapterId: chapterInfo.id, take: 10, skip: 0 });
    const [openUpdateChapter, setOpenUpdateChapter] = useState(false);
    const [openQuestion, setOpenQuestion] = useState(false);
    const [questionInfo, setQuestionInfo] = useState();

    const getData = async () => {
        try {
            setLoading(true);
            const data = await getListQuestionsTeacher(query);
            setData(data);
            // console.log(data);
        } catch (e) {
            //
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, [query]);

    const handleNavigate = (newQuery) => {
        setQuery({ ...query, ...newQuery });
    };

    const handleSearch = (search) => {
        handleNavigate({ search, skip: 0 });
    };

    const handlePageChange = (page, pageSize) => {
        handleNavigate({ take: pageSize, skip: (page - 1) * pageSize });
    };

    const handleDeleteQuestion = async (id) => {
        Modal.confirm({
            title: `Bạn có muốn xóa câu hỏi này?`,
            cancelText: 'Hủy bỏ',
            okText: 'Xác nhận',
            okType: 'danger',
            onOk: async () => {
                try {
                    setLoading(true);
                    await deleteQuestion([id]);
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
            ellipsis: true,
            align: 'center',
            width: '15%',
            render: (text, record, index) => <>{index + 1 + query.skip}</>,
        },
        {
            title: 'Câu hỏi',
            dataIndex: ['question', 'question'],
        },
        {
            key: 'action',
            dataIndex: 'id',
            render: (id, record) => (
                <Dropdown
                    placement="bottomRight"
                    menu={{
                        items: [
                            {
                                label: 'Sửa câu hỏi',
                                onClick: () => {
                                    setQuestionInfo(record);
                                    setOpenQuestion(true);
                                },
                            },
                            {
                                label: 'Xoá câu hỏi',
                                onClick: () => handleDeleteQuestion(id),
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
            <UpdateChapterModal
                open={openUpdateChapter}
                chapterInfo={chapterInfo}
                onCancel={() => setOpenUpdateChapter(false)}
                onSaved={onUpdateChapter}
            />
            <QuestionModal
                open={openQuestion}
                questionInfo={questionInfo}
                onCancel={() => setOpenQuestion(false)}
                onSaved={getData}
            />
            <div className="flex justify-between">
                <div className="space-x-2">
                    <Button onClick={() => setOpenUpdateChapter(true)}>Đổi tên chương</Button>
                    <Button
                        onClick={() => {
                            setQuestionInfo(undefined);
                            setOpenQuestion(true);
                        }}
                    >
                        Tạo câu hỏi
                    </Button>
                </div>
                <div className="flex items-center space-x-2 w-full md:w-fit">
                    <Input.Search
                        allowClear
                        size="default"
                        placeholder="Tìm kiếm câu hỏi"
                        enterButton
                        onSearch={(value) => handleSearch(value)}
                    />
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
};
