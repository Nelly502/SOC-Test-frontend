import { useSelector } from 'react-redux';
import {
    UserOutlined,
    DownOutlined,
    ProfileOutlined,
    LogoutOutlined,
    BookOutlined,
    ReadOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router';
import logo from '../../assets/images/logo.png';

export function AppHeader() {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const items = [
        {
            key: '1',
            label: <Link to="/profile">Thông tin</Link>,
            icon: <ProfileOutlined />,
        },
        {
            key: '2',
            label: <Link to="/logout">Thoát</Link>,
            icon: <LogoutOutlined />,
        },
    ];

    return (
        <div className="app-header h-18 flex items-center justify-between px-6 border-0 border-b-2 border-gray-300 border-solid">
            <Link to="/" className="h-full p-1">
                <img className="h-full w-full object-contain" src={logo} alt="" />
            </Link>

            <div className="flex items-center space-x-4">
                {user.role === 1 && (
                    <div className="flex space-x-2 cursor-pointer text-black placeholder:items-center text-lg">
                        <div
                            className=" hover:bg-slate-200 opacity-80 border-slate-200 rounded px-2 py-1 flex flex-row gap-2"
                            onClick={() => navigate(`/teacher/classes`)}
                        >
                            <BookOutlined />
                            Lớp học
                        </div>
                        <div
                            className=" hover:bg-slate-200 opacity-80 border-slate-200  rounded px-2 py-1 flex flex-row gap-2"
                            onClick={() => navigate(`/teacher/subjects`)}
                        >
                            <ReadOutlined />
                            Môn học
                        </div>
                    </div>
                )}

                {user.role === 2 && (
                    <div className="flex space-x-2 cursor-pointer text-black placeholder:items-center text-lg">
                        <div
                            className=" hover:bg-slate-200 opacity-80 border-slate-200 rounded px-2 py-1 flex flex-row gap-2"
                            onClick={() => navigate(`/student/classes`)}
                        >
                            <BookOutlined />
                            Lớp học
                        </div>
                        <div
                            className=" hover:bg-slate-200 opacity-80 border-slate-200  rounded px-2 py-1 flex flex-row gap-2"
                            onClick={() => navigate(`/student/subjects`)}
                        >
                            <ReadOutlined />
                            Môn học
                        </div>
                    </div>
                )}

                <div>
                    <Dropdown menu={{ items }} placement="bottom" className="border border-solid rounded p-2">
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <UserOutlined />
                                <p className="max-w-40 truncate">{`${user.familyName} ${user.givenName}`}</p>
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </div>
            </div>
        </div>
    );
}
