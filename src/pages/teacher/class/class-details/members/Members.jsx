import { useParams } from 'react-router';
import { useState } from 'react';
import { AddMemberModal } from './AddMemberModal';
import { Teachers } from './Teachers.jsx';
import { Students } from './Students.jsx';
import { Tabs } from 'antd';

export function Members() {
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [update, setUpdate] = useState(false);

    const { id } = useParams();

    const addNewMember = () => {
        setUpdate(!update);
    };

    const openAddModal = () => {
        setIsAddingMember(true);
    };

    const closeAddMemberModal = () => {
        setIsAddingMember(false);
    };

    return (
        <div className="h-full">
            <Tabs
                className="h-full hidden md:flex"
                destroyInactiveTabPane
                tabPosition="left"
                items={[
                    {
                        label: 'Giảng viên',
                        key: 0,
                        children: <Teachers classId={id} onShowAdd={openAddModal} update={update} />,
                    },
                    {
                        label: 'Sinh viên',
                        key: 1,
                        children: <Students classId={id} onShowAdd={openAddModal} update={update} />,
                    },
                ]}
            />
            <Tabs
                className="h-full md:hidden"
                destroyInactiveTabPane
                items={[
                    {
                        label: 'Giảng viên',
                        key: 0,
                        children: <Teachers classId={id} onShowAdd={openAddModal} update={update} />,
                    },
                    {
                        label: 'Sinh viên',
                        key: 1,
                        children: <Students classId={id} onShowAdd={openAddModal} update={update} />,
                    },
                ]}
            />
            <AddMemberModal id={id} open={isAddingMember} onClose={closeAddMemberModal} onAdd={addNewMember} />
        </div>
    );
}
