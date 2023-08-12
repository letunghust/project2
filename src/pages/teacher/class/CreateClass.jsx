import { Button, Form, Input, InputNumber, Modal, Radio, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import { createClass } from "../../../request/class.request.js";
import { useSelector } from "react-redux";
import Title from "antd/es/typography/Title.js";

const { TextArea } = Input;

export const CreateClass = ({ isOpen, onOk, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState(0);
    const [numberValue, setNumberValue] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const user = useSelector((state) => state.user);

    const onChange = (e) => {
        console.log("radio checked", e.target.value);
        setValue(e.target.value);
    };

    const handeChangeInputNumber = (value) => {
        console.log(value);
        setNumberValue(value);
    };

    const handleFinish = async () => {
        try {
            setLoading(true);

            const values = await form.validateFields();
            console.log(values);

            await createClass(values);
            form.resetFields();
            message.success("Tạo mới thành công");

            navigate("/teacher/classes");
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create">
            <Modal open={isOpen} onOk={onOk} onCancel={onCancel} footer={null}>
                <h2>Tạo lớp học mới</h2>
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="description" label="Description" rules={[{ required: true, whitespace: true }]}>
                        <TextArea />
                    </Form.Item>

                    <Form.Item name="joinCode" label="Join Code" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="classNumber" label="CLass Number" rules={[{ required: true }]}>
                        <InputNumber
                            min={0}
                            max={100000}
                            defaultValue={0}
                            onChange={handeChangeInputNumber}
                            value={numberValue}
                        />
                    </Form.Item>

                    <Form.Item name="requirePermission" required>
                        <Radio.Group onChange={onChange} value={value}>
                            <Radio value={true} checked={true}>
                                Required
                            </Radio>
                            <Radio value={false}>Not Required</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "right",
                            alignItems: "center",
                        }}
                    >
                        <div></div>
                        <Button type="primary" htmlType="submit" loading={loading} onClick={onCancel}>
                            Tạo mới
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};
