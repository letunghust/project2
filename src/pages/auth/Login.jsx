import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Form, Input, Row, message } from "antd";
import "../../assets/styles/login.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slice/user.slice.js";
import { login } from "../../request/auth.request.js";
import { rememberUser } from "../../redux/slice/option.slice.js";
import { useNavigate } from "react-router";

export const Login = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [remember, setRemember] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onChange = () => {
        setRemember(!remember);
    };

    const onFinish = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            console.log(values);
            const data = await login({ email: values.email, password: values.password });

            dispatch(updateUser(data.user));

            if (data.user.role === 1) navigate("/teacher/home");
            if (data.user.role === 2) navigate("/student/home");

            message.success("Đăng nhập thành công");
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        dispatch(rememberUser({ remember }));
    }, [remember]);

    return (
        <Form
            form={form}
            name="normal_login"
            className="login-form"
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
        >
            <Form.Item
                name="email"
                rules={[
                    {
                        required: true,
                        pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                        message: "Email không hợp lệ",
                    },
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: "Please input your Password!",
                    },
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox onChange={onChange} value={remember}>
                        Remember me
                    </Checkbox>
                </Form.Item>

                <a className="login-form-forgot" href="">
                    Forgot password
                </a>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                </Button>
                Or <a href="/register">register now!</a>
            </Form.Item>
        </Form>
    );
};
