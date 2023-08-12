import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Header } from "antd/es/layout/layout.js";
import { useNavigate } from "react-router";
import "../../assets/styles/styles.css";
import { useSelector } from "react-redux";
const { Content, Footer } = Layout;

export const HomeHeader = ({ children }) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const option = useSelector((state) => state.option);
    const user = useSelector((state) => state.user);

    const navigate = useNavigate();
    const handleLoginClick = () => {
        console.log({ option });
        if (option && user) {
            if (option.remember === true && user.role === 1) navigate("/teacher/home");
            else if (option.remember === true && user.role === 2) navigate("/student/home");
            else navigate("/login");
        } else navigate("/login");
    };

    const handleRegisterClick = () => {
        navigate("/register");
    };

    const items = [
        {
            key: "login",
            label: <a onClick={handleLoginClick}>Đăng nhập</a>,
        },
        {
            key: "register",
            label: <a onClick={handleRegisterClick}>Đăng ký</a>,
        },
    ];

    return (
        <Header
            style={{
                position: "sticky",
                top: 0,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "right",
            }}
        >
            <Menu theme="dark" mode="horizontal" items={items} />
        </Header>
    );
};
