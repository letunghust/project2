import { Header } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUserCircle, FaUserFriends } from "react-icons/fa";
import { Menu } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { removeAccessToken } from "../../utils/storage.util";
import { removeUser } from "../../redux/slice/user.slice.js";
import { rememberUser } from "../../redux/slice/option.slice.js";

export const AppTeacherHeader = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const navigate = useNavigate();

    const handleLogout = () => {
        removeAccessToken();
        dispatch(removeUser({}));
        dispatch(rememberUser({ remember: false, classId: null }));
        navigate("/");
    };

    const handleHome = () => {
        navigate("/teacher/home");
    };

    const handleGetListClass = () => {
        navigate("/teacher/classes");
    };
    const handleUserSetting = () => {
        navigate("/user");
    };

    const leftItems = [
        {
            key: "/class",
            label: (
                <a href="" onClick={handleGetListClass}>
                    Lớp học
                </a>
            ),
            icon: <FaUserFriends />,
        },
    ];

    const rightItems = [
        {
            key: "/user",
            label: `${user?.email}`,
            icon: <FaUserCircle />,
            children: [
                {
                    key: "user/manage",
                    label: <a onClick={handleUserSetting}>Quản lý tài khoản</a>,
                },
                {
                    key: "user/logout",
                    label: (
                        <a href="" onClick={handleLogout}>
                            Đăng xuất
                        </a>
                    ),
                    icon: <FaSignOutAlt />,
                },
            ],
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
                justifyContent: "space-between",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <img
                    src="https://edu.soict.ai/wp-content/uploads/2023/05/logo-soict-hust-1.png"
                    alt=""
                    style={{
                        width: 90,
                        marginRight: 10,
                    }}
                    onClick={handleHome}
                />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]} items={leftItems} />
            </div>
            <Menu theme="dark" mode="horizontal" items={rightItems} />
        </Header>
    );
};
