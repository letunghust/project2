import { Button, Descriptions, Image, Space } from "antd";
import Title from "antd/es/typography/Title.js";
import Dropzone from 'react-dropzone';
import { useState } from "react";
import { useSelector } from "react-redux";
import { UserSetting } from "./UserSettings.js";
import { ChangePassword } from "./ChangePassword.jsx";
import AvatarUploader from "./AvatarUploader.js";

export const UserInfo = () => {
    const user = useSelector((state) => state.user);
    const [openSetting, setOpenSetting] = useState(false);
    const [openChangePassword, setOpenChangePassword] = useState(false);

    const handleOk = () => {
        setOpenSetting(false);
    };

    const handleCancel = () => {
        setOpenSetting(false);
    };

    const handleChangeOk = () => {
        setOpenChangePassword(false);
    };

    const handleChangeCancel = () => {
        setOpenChangePassword(false);
    };

    if (!user) return;

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Title>Thông tin người dùng</Title>

                <Button onClick={() => setOpenSetting(true)}>Chỉnh sửa</Button>
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {/* <Image
                    src="https://media.istockphoto.com/id/1393750072/vector/flat-white-icon-man-for-web-design-silhouette-flat-illustration-vector-illustration-stock.jpg?s=612x612&w=0&k=20&c=s9hO4SpyvrDIfELozPpiB_WtzQV9KhoMUP9R9gVohoU="
                    alt=""
                    style={{
                        width: 300,
                    }}
                    /> */}
                    <AvatarUploader/>

                <div
                    style={{
                        marginLeft: 70,
                    }}
                >
                    <Descriptions layout="vertical" column={2}>
                        <Descriptions.Item label="UserName">{`${user.firstName} ${user.lastName}`}</Descriptions.Item>
                        <Descriptions.Item label="Teacher/Student Number">{user.number}</Descriptions.Item>

                        <Descriptions.Item label="Password">**********</Descriptions.Item>

                        <Descriptions.Item label="Email" span={2}>
                            {user.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Role">
                            {user.role === 1 ? "Giảng viên" : "Sinh viên"}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div></div>
                <Button>
                    <div onClick={() => setOpenChangePassword(true)}>Đổi mật khẩu</div>
                </Button>
            </div>
            <UserSetting isOpen={openSetting} handleOk={handleOk} handleCancel={handleCancel} />
            <ChangePassword
                isOpen={openChangePassword}
                handleChangeOk={handleChangeOk}
                handleChangeCancel={handleChangeCancel}
            />
        </div>
    );
};
