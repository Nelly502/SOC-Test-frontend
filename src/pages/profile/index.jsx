import { useState } from 'react';
import MenuOptions from './MenuOptions';
import ProfileEdit from './ProfileEdit';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';

export function Profile() {
    const [option, setOption] = useState(-1);
    /*
    -1-default at first mounted
    0-default
    1-edit profile
    2-change password
    3-delete account
    */
    //for option 1 -> 3
    const getClassName = (myOption) => {
        const base = 'relative bg-white min-w-100  p-10  rounded-md shadow-xl absolute text-center';
        if (option === myOption) return `${base} profile-move-front`;
        else return `hidden`;
    };

    return (
        <section className="h-screen w-full flex justify-center items-center p-6">
            <MenuOptions option={option} setOption={setOption} />
            <ProfileEdit option={option} setOption={setOption} getClassName={getClassName} />
            <ChangePassword option={option} setOption={setOption} getClassName={getClassName} />
            <DeleteAccount option={option} setOption={setOption} getClassName={getClassName} />
        </section>
    );
}
