import { Input, Modal, message, List, Avatar, Button, Divider } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useRef, useState } from 'react';
import { getUsers, addMember } from '../../../../../requests/teacher/teacher-members.request';
import { debounce } from 'lodash';

export function AddMemberModal({ open, onClose, id, onAdd }) {
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState({});
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(Infinity);

    const loadingMore = useRef(false);

    const successMessage = () => {
        message.success('Thêm thành công!');
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            if (!query.search) {
                setUsers([]);
                setTotal(0);
                return;
            }
            const { records, total } = await getUsers(query);
            setUsers(records);
            setTotal(total);
        } catch (error) {
            //
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [query]);

    useEffect(() => {
        setQuery({});
    }, [open]);

    const handleAddNewMember = async (user) => {
        await addMember({ classId: Number(id), userId: Number(user.id) }).then((result) => {
            onAdd(user);
            successMessage();
        });
    };

    const handleSearch = (search) => {
        setQuery({ search });
    };
    const debounceSearch = debounce(handleSearch, 400);

    const handleNext = async () => {
        if (!loadingMore.current) {
            try {
                loadingMore.current = true;
                const { records, total } = await getUsers({ ...query, skip: users.length });
                setUsers([...users, ...records]);
                setTotal(total);
            } catch (error) {
                //
            } finally {
                loadingMore.current = false;
            }
        }
    };

    return (
        <>
            <Modal title="Thêm thành viên" open={open} onCancel={onClose} footer={null}>
                <Input.Search
                    allowClear
                    size="default"
                    placeholder="Tìm kiếm người dùng"
                    enterButton
                    onSearch={handleSearch}
                    onChange={(e) => debounceSearch(e.target.value)}
                    loading={loading}
                />
                <div id="scrollable-div" className="h-100 mt-2 overflow-auto">
                    <InfiniteScroll
                        dataLength={users.length}
                        next={handleNext}
                        hasMore={users.length < total}
                        loader={
                            // <Skeleton
                            //     avatar
                            //     paragraph={{
                            //         rows: 1,
                            //     }}
                            //     active
                            // />
                            <div className="text-center">
                                <Button onClick={handleNext}>Tải thêm</Button>
                            </div>
                        }
                        endMessage={<Divider plain>Không còn dữ liệu</Divider>}
                        scrollableTarget="scrollable-div"
                    >
                        {users.length > 0 && (
                            <List
                                dataSource={users}
                                renderItem={(user) => (
                                    <List.Item key={user.email}>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar src="https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png" />
                                            }
                                            title={`${user.familyName} ${user.givenName}${
                                                user.studentNumber ? ` - ${user.studentNumber}` : ''
                                            }`}
                                            description={user.email}
                                        />
                                        <Button onClick={() => handleAddNewMember(user)} className="mr-2">
                                            Thêm
                                        </Button>
                                    </List.Item>
                                )}
                            />
                        )}
                    </InfiniteScroll>
                </div>
            </Modal>
        </>
    );
}
