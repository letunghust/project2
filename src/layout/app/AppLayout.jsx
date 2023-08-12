import { Breadcrumb, Layout, theme } from "antd";
import "../../assets/styles/styles.css";
import { useSelector } from "react-redux";
import { HomeHeader } from "./HomeHeader.jsx";
import { AppTeacherHeader } from "./AppTeacherHeader.jsx";
import { AppStudentHeader } from "./AppStudentHeader.jsx";
import { useLocation } from "react-router";
const { Content } = Layout;

export const AppLayout = ({ children }) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const user = useSelector((state) => state.user);
    const location = useLocation();

    return (
        <Layout
            style={{
                height: "100%",
            }}
            className="app-layout"
        >
            {!user ? <HomeHeader /> : user.role === 1 ? <AppTeacherHeader /> : <AppStudentHeader />}

            <Content
                style={{
                    padding: "0 50px",
                }}
                className="content-layout"
            >
                <Breadcrumb
                    style={{
                        margin: "16px 0",
                    }}
                ></Breadcrumb>
                {location.pathname === "/teacher/home" ||
                location.pathname === "/student/home" ||
                location.pathname === "/" ? (
                    <div></div>
                ) : (
                    <div
                        className="content-box"
                        style={{
                            padding: 24,
                            background: colorBgContainer,
                            height: 500,
                        }}
                    >
                        {children}
                    </div>
                )}
            </Content>
        </Layout>
    );
};
