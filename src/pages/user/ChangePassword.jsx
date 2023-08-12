import { Button, Form, Input, Modal, message } from "antd";
import { useState } from "react";
import { changePassword, updateUserData } from "../../request/user.request.js";

const formItemLayout = {
    labelCol: {
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        sm: {
            span: 24,
        },
    },
};

export const ChangePassword = ({ isOpen, handleChangeOk, handleChangeCancel }) => {
    const [loading, setLoading] = useState();
    const [form] = Form.useForm();
    const handleFinish = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            await changePassword({ oldPassword: values.oldPassword, newPassword: values.newPassword });
            message.success("Đổi mật khẩu thành công");
            handleChangeOk();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <Modal open={isOpen} onOk={handleChangeOk} onCancel={handleChangeCancel} footer={null}>
                <h2>Đổi mật khẩu</h2>
                <Form {...formItemLayout} form={form} onFinish={handleFinish}>
                    <Form.Item
                        name="oldPassword"
                        label="Old Password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your old password!",
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="New Password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your new password!",
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={["newPassword"]}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Please confirm your new password!",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("The new password that you entered do not match!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <div></div>
                            <Button
                                htmlType="submit"
                                style={{
                                    color: "white",
                                    backgroundColor: "#225ebe",
                                }}
                            >
                                Lưu
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
