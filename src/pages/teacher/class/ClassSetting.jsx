import { Button, Form, Input, message, Modal, InputNumber, Radio } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { updateClass } from "../../../request/class.request.js";
import { useSelector } from "react-redux";

const formItemLayout = {
    labelCol: {
        sm: {
            span: 4,
        },
    },
    wrapperCol: {
        sm: {
            span: 24,
        },
    },
};

export const ClassSetting = ({ isOpen, onOk, onCancel, _class, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState(false);
    const onChange = (value) => {
        console.log(value);
        setValue(value);
    };

    const option = useSelector((state) => state.option);

    const navigate = useNavigate();
    const [form] = Form.useForm();

    useEffect(() => {
        handleEdit(_class);
    }, [_class]);

    const handleEdit = (data) => {
        // const {classNumber, name, requirePermission, joinCode, }
        form.setFieldsValue(data);
    };

    const onFinish = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            await updateClass(option.classId, values);
            form.resetFields();
            message.success("Chỉnh sửa thành công");
            onUpdate();

            navigate("/teacher/classes");
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const [numberValue, setNumberValue] = useState(0);

    const handeChangeInputNumber = (value) => {
        console.log(value);
        setNumberValue(value);
    };

    return (
        <Modal open={isOpen} onOk={onOk} onCancel={onCancel} footer={null}>
            <h2>Chỉnh sửa lớp học</h2>
            <Form
                {...formItemLayout}
                layout="horizontal"
                form={form}
                onFinish={onFinish}
                validateTrigger="onBlur"
                className="md:w-2/5 w-full sm:mt-5 mt-2 form-shadow  sm:border-0 border-1 border-solid border-slate-200  p-5 rounded m-auto "
                size="middle"
                name="update-class"
            >
                <Form.Item label="Mã lớp" name="classNumber">
                    <InputNumber min={0} max={1000000} onChange={handeChangeInputNumber} value={numberValue} />
                </Form.Item>
                <Form.Item label="Tên lớp" name="name">
                    <Input />
                </Form.Item>
                <Form.Item label="Mô tả" name="description">
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Join Code" name="joinCode">
                    <Input />
                </Form.Item>

                <Form.Item label="Trạng thái" name="requirePermission">
                    <Radio.Group onChange={onChange} value={value}>
                        <Radio value={true}>Required</Radio>
                        <Radio value={false}>Not Required</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={onCancel}>
                        Lưu
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};
