import { Input, Modal, message, List, Button } from "antd";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { addMember, getUsers } from "../../../../request/class-members.request.js";

export const AddMemberModal = ({ isAddingMember, closeAddMemberModal, id, addNewMember }) => {
    const [queryUser, setQueryUser] = useState("");
    const [users, setUsers] = useState([]);

    const getFilteredUsers = useMemo(() => {
        if (!queryUser) return users;
        const filtereUsers = users.filter((user) => {
            return `${user.number}: ${user.firstName} ${user.lastName}`.toUpperCase().includes(queryUser.toUpperCase());
        });
        return filtereUsers;
    }, [queryUser]);

    const [messageApi, contextHolder] = message.useMessage();

    const successMessage = () => {
        messageApi.open({
            type: "success",
            content: "Thêm thành công!",
        });
    };
    const failMessage = () => {
        messageApi.open({
            type: "error",
            content: "Thêm thất bại !",
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const users = await getUsers();
                setUsers(
                    users.records.map((user) => ({
                        ...user,
                        fullName: `${user.firstName}  ${user.lastName}`,
                    }))
                );
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    const handleAddNewMember = async (user) => {
        await addMember({ classId: Number(id), userId: Number(user.id) })
            .then((result) => {
                addNewMember(user);
                successMessage();
            })
            .catch((error) => {
                failMessage();
            });
    };

    return (
        <>
            {contextHolder}
            <Modal title="Thêm thành viên" open={isAddingMember} onCancel={closeAddMemberModal} footer={null}>
                <Input.Search
                    allowClear
                    size="default"
                    placeholder="Tìm kiếm người dùng"
                    enterButton
                    onChange={debounce((e) => setQueryUser(e?.target?.value), 400)}
                />

                <List
                    dataSource={getFilteredUsers}
                    renderItem={(user) => (
                        <List.Item key={user.email}>
                            <List.Item.Meta
                                title={`${user.firstName} ${user.lastName}${` ${user.number}`}`}
                                description={user.email}
                            />
                            <Button onClick={() => handleAddNewMember(user)}>Thêm</Button>
                        </List.Item>
                    )}
                />
            </Modal>
        </>
    );
};
