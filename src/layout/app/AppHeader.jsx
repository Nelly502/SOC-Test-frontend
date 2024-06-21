import { useSelector } from 'react-redux';
import { UserOutlined, DownOutlined, ProfileOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Dropdown, Space, Button } from 'antd';
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
        <div className="app-header h-18 flex items-center justify-between px-6">
            <Link to="/" className="h-full p-1">
                <img className="h-full w-full object-contain" src={logo} alt="" />
            </Link>
            {/* <Button onClick={() => navigate('/teacher/classes/create')}>Lớp học</Button>
            <Button onClick={() => navigate('/teacher/classes/create')}>Môn học</Button> */}
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
    );
}
