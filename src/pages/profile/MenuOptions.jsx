import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { SettingOutlined, EditOutlined, DeleteOutlined, MailOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import teacherAvatar from '../../assets/images/profile/teacherAvatar.jpg';
import studentAvatar from '../../assets/images/profile/studentAvatar.jpg';

function MenuOptions({ option, setOption }) {
    const user = useSelector((state) => state.user);

    const navigate = useNavigate();

    const getClassName = () => {
        const base = 'bg-white md:p-10 p-15 rounded-md shadow-xl absolute text-center form-shadow ';
        if (option === -1) return base.concat('z-0');
        else if (option === 0) return base.concat('profile-move-front');
        else return 'hidden';
    };

    return (
        <div className={getClassName()}>
            <div className="relative">
                <CloseOutlined
                    className={`text-base hover:text-red-500 absolute right-0 top-0 cursor-pointer z-100`}
                    onClick={() => {
                        if (user.role === 1) navigate('/teacher/classes');
                        else navigate('/student/classes');
                    }}
                />
                <img
                    src="https://ik.imagekit.io/bgcofslc/wp-content/uploads/2022/09/AAtten_Logo.png"
                    className="relative w-full h-25 sm:object-cover object-contain shadow-bottom"
                    style={{ zIndex: -1 }}
                ></img>
            </div>
            <div className="text-center ">
                <img
                    src={user.role === 2 ? studentAvatar : teacherAvatar}
                    className="object-cover  w-25 h-25 rounded-full"
                ></img>
                <div className="flex justify-center md:text-xl text-md font-semibold">
                    <MailOutlined /> <p className="ml-2 ">{user.email}</p>
                </div>
            </div>

            <div>
                <Button
                    type="primary"
                    onClick={() => {
                        setOption(1);
                    }}
                    icon={<EditOutlined className="mr-1" />}
                    className="block mb-3 mt-5 mx-auto min-w-40"
                >
                    Điều chỉnh
                </Button>

                <Button
                    type="primary"
                    onClick={() => {
                        setOption(2);
                    }}
                    icon={<SettingOutlined className="mr-1" />}
                    className="block mb-3 mx-auto min-w-40"
                >
                    Đổi mật khẩu
                </Button>

                <Button
                    type="primary"
                    onClick={() => {
                        setOption(3);
                    }}
                    icon={<DeleteOutlined className="mr-1" />}
                    className="block mb-3 mx-auto min-w-40"
                >
                    Xóa tài khoản
                </Button>
            </div>
        </div>
    );
}
export default MenuOptions;
