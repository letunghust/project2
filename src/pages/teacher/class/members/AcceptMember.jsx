import { Button, List, Modal } from "antd";
import { useEffect, useState } from "react";
import { acceptMember, getMembersTeacher } from "../../../../request/class-members.request.js";

export const AcceptMembers = ({ isOpen, onOK, onCancel, id }) => {
    const [loading, setLoading] = useState();
    const [users, setUsers] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getMembersTeacher({ classId: id });
            const waitingStudents = data.students.records.filter((record) => record.waiting === true);
            const waitingTeachers = data.teachers.records.filter((record) => record.waiting === true);

            const waiters = [...waitingTeachers, ...waitingStudents];
            console.log(waiters);

            setUsers(
                waiters.map((waiter) => ({
                    ...waiter.user,
                    fullName: `${waiter.user.firstName}  ${waiter.user.lastName}`,
                }))
            );
            console.log(users);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddNewMember = async (studentId) => {
        await acceptMember({ classId: id, studentId })
            .then(() => {
                fetchData();
                onOK();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <Modal open={isOpen} onOk={onOK} onCancel={onCancel} footer={null}>
            <Button
                onClick={() => {
                    fetchData();
                    console.log({ users });
                }}
                style={{
                    color: "white",
                    backgroundColor: "#225ebe",
                }}
            >
                Reload
            </Button>
            <List
                dataSource={users}
                loading={loading}
                renderItem={(user) => (
                    <List.Item key={user.email}>
                        <List.Item.Meta
                            title={`${user.firstName} ${user.lastName}${` ${user.number}`}`}
                            description={user.email}
                        />
                        <Button onClick={() => handleAddNewMember(user.id)}>Accept</Button>
                    </List.Item>
                )}
            />
        </Modal>
    );
};
