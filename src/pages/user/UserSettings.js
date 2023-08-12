import { Button, Space, Form, Input, Switch, message, Modal, Dropdown, Select, InputNumber } from "antd";
import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getUser, updateUserData } from "../../request/user.request";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../redux/slice/user.slice";
import Title from "antd/es/typography/Title.js";

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

export const UserSetting = ({ isOpen, handleOk, handleCancel }) => {
    const [numdisabled, setNumDisabled] = useState("true");
    const [lastNamedisabled, setLastNameDisabled] = useState(true);
    const [firstNamedisabled, setFirstNameDisabled] = useState(true);
    const [number, setNumber] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState(false);
    const dispatch = useDispatch();
    const onChange = (value) => {
        console.log(value);
        setValue(value);
    };

    const handleChangeData = () => {
        setNumDisabled(!numdisabled);
        setLastNameDisabled(!lastNamedisabled);
        setFirstNameDisabled(!firstNamedisabled);
    };

    const navigate = useNavigate();
    const [form] = Form.useForm();

    useLayoutEffect(() => {
        getUserData();
    }, []);
    const getUserData = async () => {
        try {
            setLoading(true);
            const data = await getUser();
            dispatch(updateUser(data));
            setNumber(data.number);
            setFirstName(data.firstName);
            setLastName(data.lastName);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };
    const user = useSelector((state) => state.user);
    console.log(user);
    const onFinish = async () => {
        try {
            setLoading(true);
            const formdata = await form.validateFields();
            const values = {
                firstName: formdata.firstName,
                lastName: formdata.lastName,
                number: formdata.number,
            };
            const newUser = await updateUserData(values);
            dispatch(updateUser(newUser));
            message.success("Thay đổi thành công");
            navigate(`/user`);
            handleOk();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={isOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
            <h2>Chỉnh sửa thông tin</h2>
            <Form
                {...formItemLayout}
                layout="horizontal"
                form={form}
                onFinish={onFinish}
                validateTrigger="onBlur"
                // requiredMark={false}
                className="md:w-2/5 w-full sm:mt-5 mt-2 form-shadow  sm:border-0 border-1 border-solid border-slate-200  p-5 rounded m-auto "
                // initialValues={user}
            >
                <Form.Item initialValue={user.email} label="Email" name="email">
                    <Input disabled />
                </Form.Item>
                <Form.Item initialValue={user.role === 1 ? "Giảng viên" : "Sinh viên"} label="Role" name="role">
                    <Input disabled />
                </Form.Item>
                <Form.Item label="First name" name="firstName">
                    <Space direction="horizontal">
                        <Input defaultValue={user.firstName} />
                    </Space>
                </Form.Item>
                <Form.Item label="Last name" name="lastName">
                    <Space direction="horizontal">
                        <Input defaultValue={user.lastName} />
                    </Space>
                </Form.Item>
                <Form.Item label="Number" name="number">
                    <Space direction="horizontal">
                        <Input defaultValue={user.number} />
                    </Space>
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
                        <Button type="primary" htmlType="submit">
                            Lưu
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};
