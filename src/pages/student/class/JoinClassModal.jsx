import { Input, Modal, message } from "antd";
import { useState } from "react";
import { joinClass } from "../../../request/class-members.request.js";

export const JoinClassModal = ({ isJoinClass, closeModalJoinClass, handleJoinClass }) => {
    const [classNumber, setClassNumber] = useState("");

    const handleCancel = () => {
        closeModalJoinClass();
        setClassNumber("");
    };

    const handleJoin = async () => {
        const data = await joinClass({ classNumber });
        handleJoinClass(data);
        console.log(data);
    };

    return (
        <>
            <Modal
                title="Tham gia lớp học"
                open={isJoinClass}
                cancelText="Hủy"
                okText="Tham gia"
                onCancel={handleCancel}
                onOk={handleJoin}
            >
                <Input
                    allowClear
                    size="default"
                    placeholder="Nhập mã lớp"
                    value={classNumber}
                    onChange={(e) => setClassNumber(e.target.value)}
                />
            </Modal>
        </>
    );
};
