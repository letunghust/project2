import { Button, Form, Input, Select, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import { register } from "../../request/auth.request.js";
import "../../assets/styles/register.css";
const roles = [
    {
        value: 1,
        label: "Teacher",
    },
    {
        value: 2,
        label: "Student",
    },
];
const formItemLayout = {
    labelCol: {
        sm: {
            span: 4,
        },
    },
    wrapperCol: {
        sm: {
            span: 16,
        },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 4,
        },
    },
};

export const Register = () => {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState(1);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onChange = (value) => {
        console.log("selected", value);
        setValue(value);
    };

    const onFinish = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            await register(values);

            message.success("Đăng ký thành công");

            navigate("/login");
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            {...formItemLayout}
            form={form}
            name="register"
            className="register-form"
            onFinish={onFinish}
            style={{
                // maxWidth: 600,
                width: "100%",
            }}
            scrollToFirstError
        >
            <Form.Item
                name="email"
                label="E-mail"
                rules={[
                    {
                        type: "email",
                        message: "The input is not valid E-mail!",
                    },
                    {
                        required: true,
                        message: "Please input your E-mail!",
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="password"
                label="Password"
                rules={[
                    {
                        required: true,
                        message: "Please input your password!",
                    },
                ]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="firstName"
                label="First Name"
                // tooltip="First Name"
                rules={[
                    {
                        required: true,
                        message: "Please input your first name!",
                        whitespace: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="lastName"
                label="Last Name"
                // tooltip="First Name"
                rules={[
                    {
                        required: true,
                        message: "Please input your last name!",
                        whitespace: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="number"
                label="User Number"
                dependencies={["role"]}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: "Please enter a valid user number",
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="role"
                label="Role"
                rules={[
                    {
                        required: true,
                        message: "Please select your role!",
                    },
                ]}
            >
                <Select value={value} onChange={onChange} options={roles} />
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                    Register
                </Button>
            </Form.Item>
        </Form>
    );
};
